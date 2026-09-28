import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calculator-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card-saas p-6 flex flex-col justify-between h-full group hover:border-blue-300 transition-all">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <span>{{ getIconSymbol(icon) }}</span>
          </div>
          <span class="badge" [ngClass]="getCategoryBadgeClass(category)">
            {{ category }}
          </span>
        </div>

        <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
          {{ name }}
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed mb-6">
          {{ description }}
        </p>
      </div>

      <a [routerLink]="route" class="btn-outline w-full justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
        <span>Calculate</span>
        <svg class="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </a>
    </div>
  `
})
export class CalculatorCardComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() category: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() route: string = '';

  getCategoryBadgeClass(cat: string): string {
    switch (cat.toLowerCase()) {
      case 'loans': return 'badge-blue';
      case 'finance': return 'badge-green';
      case 'salary': return 'badge-purple';
      case 'shopping': return 'badge-yellow';
      default: return 'badge-blue';
    }
  }

  getIconSymbol(iconName: string): string {
    switch (iconName) {
      case 'calculator': return '🧮';
      case 'trending-up': return '📈';
      case 'piggy-bank': return '🏦';
      case 'briefcase': return '💼';
      case 'receipt': return '🧾';
      case 'percent': return '%';
      case 'tag': return '🏷️';
      case 'fuel': return '⛽';
      case 'arrow-up-right': return '📉';
      case 'home': return '🏠';
      default: return '📊';
    }
  }
}
