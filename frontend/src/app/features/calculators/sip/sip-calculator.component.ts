import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { SipResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-sip-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <span>Wealth & Investments</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">SIP Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Estimate potential returns and future wealth value of your monthly Systematic Investment Plan.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Input Form -->
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>SIP Investment Inputs</span>
            <button (click)="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-semibold underline">Reset</button>
          </h3>

          <form [formGroup]="sipForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label">Monthly Investment Amount</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="monthlyInvestment"
                  class="form-input input-with-rupee"
                  [class.is-invalid]="isFieldInvalid('monthlyInvestment')"
                  placeholder="10000"
                />
              </div>
              @if (isFieldInvalid('monthlyInvestment')) {
                <p class="text-xs text-red-600 mt-1">Investment amount must be greater than zero.</p>
              }
            </div>

            <div>
              <label class="form-label">Expected Annual Return Rate (%)</label>
              <input
                type="number"
                step="0.1"
                formControlName="expectedAnnualReturn"
                class="form-input"
                [class.is-invalid]="isFieldInvalid('expectedAnnualReturn')"
                placeholder="12.0"
              />
              @if (isFieldInvalid('expectedAnnualReturn')) {
                <p class="text-xs text-red-600 mt-1">Return rate cannot be negative.</p>
              }
            </div>

            <div>
              <label class="form-label">Investment Duration (Years)</label>
              <input
                type="number"
                formControlName="durationYears"
                class="form-input"
                [class.is-invalid]="isFieldInvalid('durationYears')"
                placeholder="10"
              />
              @if (isFieldInvalid('durationYears')) {
                <p class="text-xs text-red-600 mt-1">Duration must be greater than zero.</p>
              }
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              @if (!loading()) {
                <span>Calculate SIP Future Value</span>
              } @else {
                <span>Calculating...</span>
              }
            </button>
          </form>
        </div>

        <!-- Result Display -->
        <div class="lg:col-span-7 space-y-6">
          
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {{ error() }}
            </div>
          }

          @if (result(); as res) {
            <div class="space-y-6">
              
              <!-- Result Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-emerald-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-600/20">
                  <span class="text-xs uppercase font-bold text-emerald-200 tracking-wider">Future Wealth Value</span>
                  <div class="text-2xl font-extrabold mt-1">₹{{ res.futureValue | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Invested</span>
                  <div class="text-xl font-bold text-slate-900 mt-1">₹{{ res.totalInvestment | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Estimated Returns</span>
                  <div class="text-xl font-bold text-emerald-600 mt-1">₹{{ res.estimatedReturns | number:'1.0-0' }}</div>
                </div>
              </div>

              <!-- Disclaimer Notice Badge -->
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-medium">
                ℹ️ <strong>Note:</strong> {{ res.disclaimer }}
              </div>

              <!-- Progress Bar Breakdown -->
              <app-simple-chart
                title="Wealth Accumulation Composition"
                type="bar"
                [barItems]="[
                  { label: 'Amount Invested', displayValue: '₹' + (res.totalInvestment | number:'1.0-0'), percentage: (res.totalInvestment / res.futureValue) * 100, colorClass: 'bg-blue-600' },
                  { label: 'Estimated Wealth Return', displayValue: '₹' + (res.estimatedReturns | number:'1.0-0'), percentage: (res.estimatedReturns / res.futureValue) * 100, colorClass: 'bg-emerald-500' }
                ]"
                [legendItems]="[
                  { label: 'Invested Capital', value: '₹' + (res.totalInvestment | number:'1.0-0'), percentage: round((res.totalInvestment / res.futureValue) * 100), colorClass: 'bg-blue-600' },
                  { label: 'Growth Gains', value: '₹' + (res.estimatedReturns | number:'1.0-0'), percentage: round((res.estimatedReturns / res.futureValue) * 100), colorClass: 'bg-emerald-500' }
                ]"
              ></app-simple-chart>

            </div>
          }

          <app-disclaimer-notice customText="SIP calculations assume compounding return rates and are intended as projection estimates only. Mutual Fund investments are subject to market risks."></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class SipCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private calculatorService = inject(CalculatorService);

  sipForm!: FormGroup;
  readonly result = signal<SipResponse | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.sipForm = this.fb.group({
      monthlyInvestment: [10000, [Validators.required, Validators.min(1)]],
      expectedAnnualReturn: [12.0, [Validators.required, Validators.min(0)]],
      durationYears: [10, [Validators.required, Validators.min(1)]]
    });

    this.calculate();
  }

  isFieldInvalid(field: string): boolean {
    const f = this.sipForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  round(val: number): number {
    return Math.round(val);
  }

  calculate(): void {
    if (this.sipForm.invalid) {
      this.sipForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.calculatorService.calculateSip(this.sipForm.value).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to calculate SIP.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.sipForm.reset({
      monthlyInvestment: 10000,
      expectedAnnualReturn: 12.0,
      durationYears: 10
    });
    this.calculate();
  }
}

