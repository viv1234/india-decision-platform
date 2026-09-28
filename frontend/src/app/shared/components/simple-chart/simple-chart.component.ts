import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <h4 class="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
        <span>{{ title }}</span>
        <span class="text-xs text-slate-500 font-normal">Visual Breakdown</span>
      </h4>

      <div class="flex flex-col md:flex-row items-center justify-around gap-6">
        
        <!-- SVG Donut Chart -->
        <div *ngIf="type === 'donut'" class="relative w-44 h-44 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <!-- Background ring -->
            <path
              class="text-slate-200"
              stroke-width="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <!-- Segment 1 (e.g. Principal) -->
            <path
              class="text-blue-600 transition-all duration-1000"
              stroke-width="4.5"
              [attr.stroke-dasharray]="pct1 + ', 100'"
              stroke-linecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span class="text-xs font-semibold text-slate-500">{{ centerLabel }}</span>
            <span class="text-sm font-extrabold text-slate-900">{{ centerValue }}</span>
          </div>
        </div>

        <!-- Progress Bar Chart (for Comparison) -->
        <div *ngIf="type === 'bar'" class="w-full space-y-4">
          <div *ngFor="let item of barItems">
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-700">{{ item.label }}</span>
              <span class="text-slate-900 font-bold">{{ item.displayValue }}</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                [ngClass]="item.colorClass || 'bg-blue-600'"
                [style.width.%]="item.percentage"
              ></div>
            </div>
          </div>
        </div>

        <!-- Legend list -->
        <div class="w-full md:w-auto space-y-3">
          <div *ngFor="let item of legendItems" class="flex items-center gap-3 text-xs">
            <div class="w-3.5 h-3.5 rounded-full flex-shrink-0" [ngClass]="item.colorClass"></div>
            <div class="flex flex-col">
              <span class="text-slate-500 font-medium">{{ item.label }}</span>
              <span class="text-slate-900 font-bold">{{ item.value }} ({{ item.percentage }}%)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SimpleChartComponent {
  @Input() title: string = 'Breakdown';
  @Input() type: 'donut' | 'bar' = 'donut';
  @Input() pct1: number = 70; // 0 to 100
  @Input() centerLabel: string = 'Total';
  @Input() centerValue: string = '₹0';
  @Input() legendItems: Array<{ label: string; value: string; percentage: number; colorClass: string }> = [];
  @Input() barItems: Array<{ label: string; displayValue: string; percentage: number; colorClass?: string }> = [];
}
