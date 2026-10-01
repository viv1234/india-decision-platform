import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculatorService } from '../../../core/services/calculator.service';
import { AiOrchestrationResponse } from '../../../core/models/calculator.model';

@Component({
  selector: 'app-ai-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-4 sm:p-6 border border-slate-200 relative overflow-y-auto max-h-[92vh]">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20" aria-hidden="true">
              ⚡
            </div>
            <div>
              <h2 id="ai-modal-title" class="text-base font-bold text-slate-900">AI Decision Assistant</h2>
              <p class="text-xs text-slate-600">Goal → Intent → Calculator Selection → Explanation</p>
            </div>
          </div>
          <button
            (click)="close.emit()"
            class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            aria-label="Close AI Assistant Modal"
          >
            ✕
          </button>
        </div>

        <!-- Sample prompts -->
        <div class="mb-4">
          <span id="sample-queries-label" class="text-xs font-bold text-slate-700 block mb-2">Try a sample decision query:</span>
          <div class="flex flex-wrap gap-2" aria-labelledby="sample-queries-label">
            <button
              *ngFor="let sample of sampleQueries"
              (click)="setQuery(sample)"
              class="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              "{{ sample }}"
            </button>
          </div>
        </div>

        <!-- Input Box -->
        <div class="space-y-3 mb-6">
          <label for="ai-query-input" class="form-label text-xs">Describe your goal or question:</label>
          <textarea
            id="ai-query-input"
            [(ngModel)]="userQuery"
            rows="3"
            placeholder="e.g. I earn ₹1 lakh per month. Can I afford a ₹25 lakh car?"
            class="form-input text-sm resize-none"
          ></textarea>

          <button
            (click)="orchestrate()"
            [disabled]="loading || !userQuery.trim()"
            [attr.aria-busy]="loading"
            class="btn-primary w-full justify-center gap-2 cursor-pointer"
          >
            <span *ngIf="!loading">Analyze Goal & Recommend Calculator</span>
            <span *ngIf="loading" class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Parsing Intent...
            </span>
          </button>
        </div>

        <!-- Result / Orchestration Output -->
        <div *ngIf="orchestrationResult" class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs animate-fade-in">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Detected Intent</span>
              <span class="badge badge-purple">{{ orchestrationResult.intentCode }}</span>
            </div>
            <span
              *ngIf="orchestrationResult.decisionVerdict"
              [class]="'text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider shadow-sm ' + (orchestrationResult.badgeColor || 'bg-emerald-500')"
            >
              {{ (orchestrationResult.decisionVerdict || 'HEALTHY').replace('_', ' ') }}
            </span>
          </div>

          <!-- Key Metrics Chips -->
          <div *ngIf="orchestrationResult.keyMetrics && objectKeys(orchestrationResult.keyMetrics).length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div *ngFor="let key of objectKeys(orchestrationResult.keyMetrics)" class="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span class="text-[10px] font-semibold text-slate-500 uppercase block truncate">{{ key }}</span>
              <span class="text-xs font-extrabold text-blue-900 block mt-0.5">{{ orchestrationResult.keyMetrics[key] }}</span>
            </div>
          </div>

          <!-- RAG Knowledge Snippets -->
          <div *ngIf="orchestrationResult.retrievedContext && orchestrationResult.retrievedContext.length > 0" class="space-y-1.5">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Retrieved Financial Rule:</span>
            <div *ngFor="let snippet of orchestrationResult.retrievedContext" class="bg-blue-50/80 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-xs font-medium">
              💡 {{ snippet }}
            </div>
          </div>

          <!-- AI Explanation -->
          <div class="bg-white p-3.5 rounded-xl border border-slate-200">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">AI Recommendation & Analysis:</span>
            <p class="text-slate-900 font-medium leading-relaxed">
              {{ orchestrationResult.explanation }}
            </p>
          </div>

          <!-- Interactive Follow-Up Questions -->
          <div *ngIf="orchestrationResult.followUpQuestions && orchestrationResult.followUpQuestions.length > 0" class="space-y-2 pt-1">
            <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Ask a follow-up question:</span>
            <div class="flex flex-col gap-1.5">
              <button
                *ngFor="let followUp of orchestrationResult.followUpQuestions"
                (click)="askFollowUp(followUp)"
                class="text-xs bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-slate-700 font-medium p-2.5 rounded-xl border border-slate-200 transition-colors text-left flex items-center justify-between cursor-pointer group"
              >
                <span>💬 "{{ followUp }}"</span>
                <span class="text-amber-500 group-hover:translate-x-1 transition-transform font-bold">→</span>
              </button>
            </div>
          </div>

          <!-- Open Calculator Action -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-200">
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-500 font-semibold uppercase">Recommended Tool</span>
              <span class="font-bold text-blue-800 text-xs sm:text-sm">{{ orchestrationResult.calculatorName }}</span>
            </div>
            <button (click)="navigateToCalculator()" class="btn-primary text-xs py-2 px-3.5 cursor-pointer shadow-md">
              Open {{ orchestrationResult.calculatorName }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AiModalComponent {
  @Output() close = new EventEmitter<void>();

  userQuery: string = 'I earn ₹1 lakh per month. Can I afford a ₹25 lakh car?';
  loading: boolean = false;
  orchestrationResult: AiOrchestrationResponse | null = null;
  objectKeys = Object.keys;

  sampleQueries = [
    'I earn ₹1 lakh per month. Can I afford a ₹25 lakh car?',
    'I want to rent a 2BHK flat for ₹30,000 per month on ₹90,000 salary',
    'What is my net in-hand salary for 15 LPA CTC?',
    'How much will ₹10,000 monthly SIP grow to in 10 years at 12% return?'
  ];

  constructor(private calculatorService: CalculatorService, private router: Router) {}

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  setQuery(q: string) {
    this.userQuery = q;
    this.orchestrationResult = null;
  }

  askFollowUp(q: string) {
    this.userQuery = q;
    this.orchestrate();
  }

  orchestrate() {
    if (!this.userQuery.trim()) return;
    this.loading = true;
    this.orchestrationResult = null;

    this.calculatorService.orchestrateAi({ userQuery: this.userQuery }).subscribe({
      next: (res) => {
        this.orchestrationResult = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  navigateToCalculator() {
    if (this.orchestrationResult) {
      this.close.emit();
      const queryParams = this.orchestrationResult.extractedParameters || {};
      this.router.navigate(['/calculators', this.orchestrationResult.recommendedCalculatorId], { queryParams });
    }
  }
}
