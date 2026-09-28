import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { PercentageResponse } from '../../../core/models/calculator.model';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          <span>General Mathematics</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Percentage Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Easily compute percentage of values, percentage increases, decreases and relative differences.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Form -->
        <div class="lg:col-span-6 card-saas p-6 space-y-5 h-fit">
          
          <!-- Mode Tabs -->
          <div class="space-y-2">
            <label class="form-label">Calculation Mode</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                *ngFor="let m of modes"
                (click)="setMode(m.key)"
                class="py-2 px-3 text-xs font-bold rounded-lg border transition-all text-left"
                [ngClass]="pctForm.get('mode')?.value === m.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
              >
                {{ m.label }}
              </button>
            </div>
          </div>

          <form [formGroup]="pctForm" (ngSubmit)="calculate()" class="space-y-4 pt-2">
            
            <div>
              <label class="form-label">{{ getXLabel() }}</label>
              <input
                type="number"
                step="any"
                formControlName="valueX"
                class="form-input"
                placeholder="25"
              />
            </div>

            <div>
              <label class="form-label">{{ getYLabel() }}</label>
              <input
                type="number"
                step="any"
                formControlName="valueY"
                class="form-input"
                placeholder="200"
              />
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              <span *ngIf="!loading">Calculate Percentage</span>
              <span *ngIf="loading">Calculating...</span>
            </button>
          </form>
        </div>

        <!-- Result -->
        <div class="lg:col-span-6 space-y-6">
          
          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
            {{ error }}
          </div>

          <div *ngIf="result" class="card-saas p-8 text-center space-y-4 bg-gradient-to-br from-white to-blue-50/50">
            <span class="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Result Value</span>
            <div class="text-4xl font-extrabold text-slate-900">{{ result.result | number:'1.0-4' }}</div>
            <p class="text-sm font-semibold text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {{ result.explanation }}
            </p>
          </div>

          <app-disclaimer-notice></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class PercentageCalculatorComponent implements OnInit {
  pctForm!: FormGroup;
  result: PercentageResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  modes = [
    { key: 'PERCENTAGE_OF', label: 'X% of Y' },
    { key: 'PERCENTAGE_INCREASE', label: 'Percentage Increase' },
    { key: 'PERCENTAGE_DECREASE', label: 'Percentage Decrease' },
    { key: 'PERCENTAGE_DIFFERENCE', label: 'Percentage Difference' }
  ];

  constructor(private fb: FormBuilder, private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.pctForm = this.fb.group({
      mode: ['PERCENTAGE_OF', Validators.required],
      valueX: [25, Validators.required],
      valueY: [200, Validators.required]
    });

    this.calculate();
  }

  setMode(mKey: string): void {
    this.pctForm.patchValue({ mode: mKey });
    this.calculate();
  }

  getXLabel(): string {
    const m = this.pctForm.get('mode')?.value;
    if (m === 'PERCENTAGE_OF') return 'Percentage Rate (X%)';
    if (m === 'PERCENTAGE_INCREASE' || m === 'PERCENTAGE_DECREASE') return 'Percentage Change (X%)';
    return 'First Value (X)';
  }

  getYLabel(): string {
    const m = this.pctForm.get('mode')?.value;
    if (m === 'PERCENTAGE_DIFFERENCE') return 'Second Value (Y)';
    return 'Base Value (Y)';
  }

  calculate(): void {
    if (this.pctForm.invalid) {
      this.pctForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.calculatorService.calculatePercentage(this.pctForm.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to calculate percentage.';
        this.loading = false;
      }
    });
  }
}
