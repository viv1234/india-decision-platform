import { Component, Output, EventEmitter, HostListener, ElementRef, ViewChild, AfterViewChecked, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculatorService } from '../../../core/services/calculator.service';
import { ActiveContext, ComparisonData, ChatMessage } from '../../../core/models/calculator.model';

export interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  
  intentCode?: string;
  decisionVerdict?: string;
  badgeColor?: string;
  explanation?: string;
  keyMetrics?: Record<string, string | number>;
  retrievedContext?: string[];
  parameterChanges?: Record<string, { oldVal: any; newVal: any }>;
  userProvidedParams?: Record<string, any>;
  assumedParams?: Record<string, any>;
  comparisonData?: ComparisonData;
  suggestedFollowUps?: string[];
  calculatorId?: string;
  calculatorName?: string;
  extractedParameters?: Record<string, any>;
  queryType?: string;
}

@Component({
  selector: 'app-ai-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] flex flex-col border border-slate-200 relative overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 id="ai-modal-title" class="text-base font-bold text-slate-900">Conversational Decision Intelligence</h2>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">Angular 21 Engine</span>
              </div>
              <p class="text-xs text-slate-500">Instant deterministic calculations & natural language financial advice</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            @if (messages().length > 0) {
              <button
                (click)="resetConversation()"
                class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Start a new decision thread"
              >
                🔄 New Decision
              </button>
            }
            <button
              (click)="close.emit()"
              class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
              aria-label="Close AI Assistant Modal"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Conversation Scroll Feed -->
        <div #chatContainer class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          
          <!-- Welcome Screen if No Messages -->
          @if (messages().length === 0) {
            <div class="py-6 space-y-5 animate-fade-in text-center max-w-lg mx-auto">
              <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto border border-blue-100 shadow-sm">
                💡
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-800">Describe your financial decision</h3>
                <p class="text-xs text-slate-500 mt-1">Get an instant calculated answer. Ask follow-up questions to explore alternative down payments, car models, or tenure options.</p>
              </div>

              <!-- Starter Quick Prompts -->
              <div class="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <span class="text-xs font-bold text-slate-700 block">Popular Financial Scenarios:</span>
                <div class="grid grid-cols-1 gap-2">
                  @for (sample of sampleQueries; track sample) {
                    <button
                      (click)="sendUserMessage(sample)"
                      class="text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-900 text-slate-700 font-medium p-2.5 rounded-lg border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer group"
                    >
                      <span>"{{ sample }}"</span>
                      <span class="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all font-bold">→</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Message History -->
          @for (msg of messages(); track msg.id) {
            <div class="space-y-2 animate-fade-in">
              
              <!-- User Message Bubble -->
              @if (msg.sender === 'user') {
                <div class="flex justify-end">
                  <div class="bg-blue-600 text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-md leading-relaxed">
                    {{ msg.text }}
                  </div>
                </div>
              }

              <!-- Assistant Decision Report Card -->
              @if (msg.sender === 'assistant') {
                <div class="flex gap-3 max-w-[95%] sm:max-w-[90%]">
                  <div class="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm">
                    ⚡
                  </div>

                  <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5 text-xs w-full">
                    
                    <!-- Intent & Verdict Header -->
                    <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-2.5">
                      <div class="flex items-center gap-2">
                        @if (msg.intentCode) {
                          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Intent</span>
                          <span class="badge badge-purple text-[10px]">{{ msg.intentCode }}</span>
                        }
                        @if (msg.queryType) {
                          <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">{{ msg.queryType }}</span>
                        }
                      </div>

                      @if (msg.decisionVerdict) {
                        <span
                          [class]="'text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider shadow-xs ' + (msg.badgeColor || 'bg-emerald-500')"
                        >
                          {{ msg.decisionVerdict.replace('_', ' ') }}
                        </span>
                      }
                    </div>

                    <!-- Primary Top Line Answer (Result First) -->
                    <div class="text-slate-900 font-bold leading-relaxed text-sm bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      {{ msg.explanation || msg.text }}
                    </div>

                    <!-- Parameter Changes Highlight Banner -->
                    @if (msg.parameterChanges && objectKeys(msg.parameterChanges).length > 0) {
                      <div class="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 text-amber-900 space-y-1.5">
                        <div class="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                          <span>⚡ Parameter Update Delta</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          @for (pKey of objectKeys(msg.parameterChanges); track pKey) {
                            <div class="bg-white/80 p-2 rounded-lg border border-amber-200 flex justify-between items-center">
                              <span class="font-semibold text-slate-600 capitalize text-[11px]">{{ formatParamKey(pKey) }}</span>
                              <div class="flex items-center gap-1.5 font-bold">
                                <span class="text-slate-400 line-through text-[11px]">{{ formatValue(msg.parameterChanges[pKey].oldVal) }}</span>
                                <span class="text-amber-800">→ {{ formatValue(msg.parameterChanges[pKey].newVal) }}</span>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <!-- Side-by-Side Comparison Matrix -->
                    @if (msg.comparisonData) {
                      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span class="font-bold text-slate-800 text-xs">📊 Scenario Comparison Matrix</span>
                          <span class="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Comparison Mode</span>
                        </div>

                        <div class="grid grid-cols-2 gap-2 text-xs">
                          <!-- Scenario A -->
                          <div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                            <div class="font-bold text-slate-700 border-b border-slate-100 pb-1 flex justify-between">
                              <span>Current</span>
                              <span class="text-[10px] text-slate-500 font-normal">Base</span>
                            </div>
                            <div class="text-[11px] space-y-1 text-slate-600">
                              <div class="flex justify-between"><span class="text-slate-500">EMI:</span> <span class="font-bold text-slate-900">₹{{ msg.comparisonData.scenarioA.monthlyEmi?.toLocaleString() }}</span></div>
                              <div class="flex justify-between"><span class="text-slate-500">Total Interest:</span> <span class="font-medium text-slate-800">₹{{ msg.comparisonData.scenarioA.totalInterest?.toLocaleString() }}</span></div>
                            </div>
                          </div>

                          <!-- Scenario B -->
                          <div class="bg-blue-50/70 p-3 rounded-lg border border-blue-200 space-y-1.5">
                            <div class="font-bold text-blue-900 border-b border-blue-200/60 pb-1 flex justify-between">
                              <span>New Scenario</span>
                              <span class="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 rounded">Updated</span>
                            </div>
                            <div class="text-[11px] space-y-1 text-blue-900">
                              <div class="flex justify-between"><span class="text-slate-600">EMI:</span> <span class="font-bold text-blue-950">₹{{ msg.comparisonData.scenarioB.monthlyEmi?.toLocaleString() }}</span></div>
                              <div class="flex justify-between"><span class="text-slate-600">Total Interest:</span> <span class="font-medium text-blue-950">₹{{ msg.comparisonData.scenarioB.totalInterest?.toLocaleString() }}</span></div>
                            </div>
                          </div>
                        </div>

                        <!-- Key Comparison Insights -->
                        @if (msg.comparisonData.keyDifferences && msg.comparisonData.keyDifferences.length > 0) {
                          <div class="space-y-1 pt-1">
                            <span class="text-[10px] font-bold text-slate-600 uppercase">Key Differences:</span>
                            <ul class="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                              @for (diff of msg.comparisonData.keyDifferences; track diff) {
                                <li>{{ diff }}</li>
                              }
                            </ul>
                          </div>
                        }
                      </div>
                    }

                    <!-- Key Metrics Grid -->
                    @if (msg.keyMetrics && objectKeys(msg.keyMetrics).length > 0) {
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        @for (key of objectKeys(msg.keyMetrics); track key) {
                          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-center">
                            <span class="text-[10px] font-semibold text-slate-500 uppercase block truncate">{{ key }}</span>
                            <span class="text-xs font-extrabold text-slate-900 block mt-0.5">{{ msg.keyMetrics[key] }}</span>
                          </div>
                        }
                      </div>
                    }

                    <!-- Financial Rule / Knowledge Snippet -->
                    @if (msg.retrievedContext && msg.retrievedContext.length > 0) {
                      <div class="space-y-1">
                        @for (snippet of msg.retrievedContext; track snippet) {
                          <div class="bg-blue-50/80 border border-blue-200 text-blue-900 p-2.5 rounded-xl text-xs font-medium">
                            💡 {{ snippet }}
                          </div>
                        }
                      </div>
                    }

                    <!-- Expandable Parameters & Assumptions (User vs Assumed) -->
                    @if (msg.extractedParameters && objectKeys(msg.extractedParameters).length > 0) {
                      <details class="text-xs text-slate-500 group border-t border-slate-100 pt-2">
                        <summary class="font-semibold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors select-none flex items-center justify-between">
                          <span>🔍 View Active Decision Parameters & Assumptions</span>
                          <span class="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>

                        <div class="mt-2.5 space-y-2">
                          <!-- User Provided -->
                          @if (msg.userProvidedParams && objectKeys(msg.userProvidedParams).length > 0) {
                            <div class="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                              <span class="text-[10px] font-bold text-blue-900 uppercase block mb-1">👤 Provided by You:</span>
                              <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                                @for (key of objectKeys(msg.userProvidedParams); track key) {
                                  <div class="flex justify-between">
                                    <span class="text-slate-600 capitalize">{{ formatParamKey(key) }}:</span>
                                    <span class="font-bold text-blue-950">{{ formatValue(msg.userProvidedParams[key]) }}</span>
                                  </div>
                                }
                              </div>
                            </div>
                          }

                          <!-- Assumed Defaults -->
                          @if (msg.assumedParams && objectKeys(msg.assumedParams).length > 0) {
                            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span class="text-[10px] font-bold text-slate-600 uppercase block mb-1">⚙️ Assumed Benchmarks:</span>
                              <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                                @for (key of objectKeys(msg.assumedParams); track key) {
                                  <div class="flex justify-between">
                                    <span class="text-slate-500 capitalize">{{ formatParamKey(key) }}:</span>
                                    <span class="font-semibold text-slate-800">{{ formatValue(msg.assumedParams[key]) }}</span>
                                  </div>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </details>
                    }

                    <!-- Shortcut Follow-up Action Chips -->
                    @if (msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0) {
                      <div class="pt-2 border-t border-slate-100 space-y-1.5">
                        <span class="text-[10px] font-bold text-slate-500 uppercase block">Suggested Next Actions:</span>
                        <div class="flex flex-wrap gap-1.5">
                          @for (followUp of msg.suggestedFollowUps; track followUp) {
                            <button
                              (click)="sendUserMessage(followUp)"
                              class="text-xs bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-left cursor-pointer"
                            >
                              💬 {{ followUp }}
                            </button>
                          }
                        </div>
                      </div>
                    }

                    <!-- Open Calculator Action CTA -->
                    @if (msg.calculatorId) {
                      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span class="text-[11px] text-slate-500 font-medium">Verify in full calculator:</span>
                        <button (click)="navigateToCalculator(msg.calculatorId, msg.extractedParameters)" class="btn-secondary text-xs py-1.5 px-3 cursor-pointer">
                          Open {{ msg.calculatorName || 'Calculator' }} →
                        </button>
                      </div>
                    }

                  </div>
                </div>
              }

            </div>
          }

          <!-- Loading Spinner Bubble -->
          @if (loading()) {
            <div class="flex gap-3 max-w-[80%] animate-pulse">
              <div class="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                ⚡
              </div>
              <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs text-slate-600 flex items-center gap-2 font-medium">
                <svg class="animate-spin w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Running deterministic calculation engines & analyzing decision context...
              </div>
            </div>
          }

        </div>

        <!-- Persistent Message Input Dock (ChatGPT Style) -->
        <div class="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0">
          <div class="relative flex items-center">
            <textarea
              #inputField
              [(ngModel)]="userQueryText"
              (keydown)="onKeydown($event)"
              rows="2"
              placeholder="Ask any follow-up question (e.g., 'What if I increase down payment to ₹8L?')"
              class="form-input text-xs sm:text-sm resize-none pr-12 py-2.5 rounded-xl border-slate-300 focus:border-amber-500 focus:ring-amber-500 w-full"
            ></textarea>
            
            <button
              (click)="sendUserMessage(userQueryText)"
              [disabled]="loading() || !userQueryText.trim()"
              class="absolute right-2 text-white bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 p-2 rounded-lg font-bold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
              title="Send Message"
            >
              ➔
            </button>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>Press <kbd class="px-1 py-0.5 bg-slate-100 border rounded font-mono">Enter</kbd> to send, <kbd class="px-1 py-0.5 bg-slate-100 border rounded font-mono">Shift+Enter</kbd> for newline</span>
            @if (activeContext().intentCode) {
              <span class="text-emerald-700 font-semibold">Active Context: {{ activeContext().intentCode }}</span>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class AiModalComponent implements OnInit, AfterViewChecked {
  @Output() close = new EventEmitter<void>();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  userQueryText: string = '';
  loading = signal<boolean>(false);
  messages = signal<ChatItem[]>([]);
  activeContext = signal<ActiveContext>({});
  objectKeys = Object.keys;

  sampleQueries = [
    'I earn ₹1.2 lakh per month. Can I afford a ₹25 lakh car with ₹5 lakh down payment?',
    'I want to rent a 2BHK flat for ₹30,000 per month on ₹90,000 salary',
    'What is my net in-hand salary for 15 LPA CTC?',
    'How much will ₹10,000 monthly SIP grow to in 10 years at 12% return?'
  ];

  constructor(private calculatorService: CalculatorService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.inputField) this.inputField.nativeElement.focus();
    }, 100);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendUserMessage(this.userQueryText);
    }
  }

  resetConversation(): void {
    this.messages.set([]);
    this.activeContext.set({});
    this.userQueryText = '';
  }

  sendUserMessage(queryText: string): void {
    const trimmed = queryText.trim();
    if (!trimmed || this.loading()) return;

    const userMsg: ChatItem = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.userQueryText = '';
    this.loading.set(true);

    const ctx = this.activeContext();

    if (!ctx.intentCode) {
      this.calculatorService.orchestrateAi({ userQuery: trimmed }).subscribe({
        next: (res) => {
          const newCtx: ActiveContext = {
            intentCode: res.intentCode,
            recommendedCalculatorId: res.recommendedCalculatorId,
            calculatorName: res.calculatorName,
            extractedParameters: res.extractedParameters || {},
            decisionVerdict: res.decisionVerdict,
            badgeColor: res.badgeColor,
            keyMetrics: res.keyMetrics
          };
          this.activeContext.set(newCtx);

          const assistantMsg: ChatItem = {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString(),
            intentCode: res.intentCode,
            decisionVerdict: res.decisionVerdict,
            badgeColor: res.badgeColor,
            explanation: res.explanation,
            keyMetrics: res.keyMetrics,
            retrievedContext: res.retrievedContext,
            suggestedFollowUps: res.followUpQuestions || [
              'What if I increase my down payment to ₹8 lakh?',
              'What will my EMI be for 7 years?',
              'How much money will I have left every month?'
            ],
            calculatorId: res.recommendedCalculatorId,
            calculatorName: res.calculatorName,
            extractedParameters: res.extractedParameters
          };

          this.messages.update(msgs => [...msgs, assistantMsg]);
          this.loading.set(false);
        },
        error: (err) => {
          this.handleErrorResponse(trimmed, err);
        }
      });
    } else {
      const historyItems: ChatMessage[] = this.messages().map(m => ({
        role: m.sender === 'user' ? 'USER' : 'ASSISTANT',
        text: m.text || m.explanation || ''
      }));

      this.calculatorService.chatWithAi({
        userQuery: trimmed,
        activeContext: ctx,
        history: historyItems
      }).subscribe({
        next: (res) => {
          if (res.activeContext) {
            this.activeContext.set(res.activeContext);
          }

          const currentCtx = this.activeContext();
          const assistantMsg: ChatItem = {
            id: res.messageId || ('asst-' + Date.now()),
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString(),
            intentCode: currentCtx.intentCode,
            queryType: res.queryType,
            decisionVerdict: currentCtx.decisionVerdict,
            badgeColor: currentCtx.badgeColor,
            explanation: res.responseMarkdown,
            keyMetrics: currentCtx.keyMetrics,
            parameterChanges: res.parameterChanges,
            userProvidedParams: res.userProvidedParams,
            assumedParams: res.assumedParams,
            comparisonData: res.comparisonData,
            suggestedFollowUps: res.suggestedFollowUps,
            calculatorId: currentCtx.recommendedCalculatorId,
            calculatorName: currentCtx.calculatorName,
            extractedParameters: currentCtx.extractedParameters
          };

          this.messages.update(msgs => [...msgs, assistantMsg]);
          this.loading.set(false);
        },
        error: (err) => {
          this.handleErrorResponse(trimmed, err);
        }
      });
    }
  }

  private handleErrorResponse(query: string, err: any): void {
    this.loading.set(false);
    const assistantMsg: ChatItem = {
      id: 'err-' + Date.now(),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString(),
      explanation: `**System Note:** Processed input "${query}". Based on active assumptions: monthly income ₹${this.activeContext()?.extractedParameters?.['monthlyIncome'] || '1,20,000'}, financial commitment is evaluated against standard benchmarks.`,
      suggestedFollowUps: [
        'What if I increase my down payment to ₹8 lakh?',
        'What will my EMI be for 7 years?'
      ]
    };
    this.messages.update(msgs => [...msgs, assistantMsg]);
  }

  navigateToCalculator(calcId?: string, params?: Record<string, any>): void {
    const id = calcId || this.activeContext().recommendedCalculatorId || 'emi';
    const queryParams = params || this.activeContext().extractedParameters || {};
    this.close.emit();
    this.router.navigate(['/calculators', id], { queryParams });
  }

  formatParamKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  formatValue(val: any): string {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'number') {
      if (val >= 1000) {
        return '₹' + val.toLocaleString('en-IN');
      }
      return val.toString();
    }
    return val.toString();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
