import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disclaimer-notice',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 my-6">
      <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <div class="leading-relaxed">
        <span class="font-bold block mb-0.5">Disclaimer & Advisory Notice:</span>
        <p>{{ displayText() }}</p>
      </div>
    </div>
  `
})
export class DisclaimerNoticeComponent {
  customText = input<string>('');
  
  defaultText = 'Calculations provided by this platform are for informational and educational purposes only. Results may vary based on actual interest rates, taxation rules, employer salary structure and individual financial conditions. Please verify with official financial advisors before making commitments.';
  
  displayText = computed(() => this.customText() || this.defaultText);
}

