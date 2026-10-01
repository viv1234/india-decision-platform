import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AiInsightResponse } from '../../../core/models/calculator.model';

@Component({
  selector: 'app-ai-insight-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="insight" class="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-indigo-500/20 my-6 animate-fade-in">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3.5 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/20">
            ⚡
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 tracking-wide">{{ insight.title || 'AI Decision Insight' }}</h3>
            <span class="text-[11px] text-slate-400">RAG Context & Personal Finance Rule Check</span>
          </div>
        </div>
        <span
          [class]="'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ' + (insight.badgeColor || 'bg-emerald-500')"
        >
          {{ (insight.healthStatus || 'HEALTHY').replace('_', ' ') }}
        </span>
      </div>

      <!-- Main AI Takeaway Advice -->
      <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50 mb-4">
        "{{ insight.aiTakeaway }}"
      </p>

      <!-- Key Observations Checklist -->
      <div *ngIf="insight.keyObservations && insight.keyObservations.length > 0" class="space-y-2 mb-4">
        <span class="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Key Rule Observations:</span>
        <ul class="space-y-1.5 text-xs text-slate-300">
          <li *ngFor="let obs of insight.keyObservations" class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span>{{ obs }}</span>
          </li>
        </ul>
      </div>

      <!-- Action Button -->
      <div *ngIf="insight.recommendedNextTool" class="flex justify-end pt-2 border-t border-slate-700/40">
        <a
          [routerLink]="['/calculators', insight.recommendedNextTool]"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          Explore {{ insight.recommendedNextTool.toUpperCase() }} Calculator →
        </a>
      </div>
    </div>
  `
})
export class AiInsightCardComponent {
  @Input() insight: AiInsightResponse | null = null;
}
