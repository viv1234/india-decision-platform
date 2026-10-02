import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CalculatorService } from '../../../core/services/calculator.service';
import { EmiResponse, AiInsightResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';
import { AiInsightCardComponent } from '../../../shared/components/ai-insight-card/ai-insight-card.component';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent, AiInsightCardComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Page Header -->
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          <span>Loans & Affordability</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">EMI Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Calculate your monthly loan EMI, interest amount and complete repayment breakdown.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Input Form Section -->
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Loan Details</span>
            <button (click)="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-semibold underline">Reset</button>
          </h3>

          <form [formGroup]="emiForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <!-- Loan Amount -->
            <div>
              <label for="emi-principal" class="form-label">Loan Amount (P)</label>
              <div class="relative">
                <span class="rupee-prefix" aria-hidden="true">₹</span>
                <input
                  id="emi-principal"
                  type="number"
                  formControlName="principal"
                  class="form-input input-with-rupee"
                  [class.is-invalid]="isFieldInvalid('principal')"
                  [attr.aria-invalid]="isFieldInvalid('principal')"
                  aria-describedby="principal-error"
                  placeholder="2500000"
                />
              </div>
              @if (isFieldInvalid('principal')) {
                <p id="principal-error" class="text-xs text-red-700 font-medium mt-1">Loan amount must be greater than zero.</p>
              }
            </div>

            <!-- Interest Rate -->
            <div>
              <label for="emi-interest-rate" class="form-label">Annual Interest Rate (%)</label>
              <input
                id="emi-interest-rate"
                type="number"
                step="0.1"
                formControlName="annualInterestRate"
                class="form-input"
                [class.is-invalid]="isFieldInvalid('annualInterestRate')"
                [attr.aria-invalid]="isFieldInvalid('annualInterestRate')"
                aria-describedby="rate-error"
                placeholder="8.5"
              />
              @if (isFieldInvalid('annualInterestRate')) {
                <p id="rate-error" class="text-xs text-red-700 font-medium mt-1">Interest rate cannot be negative.</p>
              }
            </div>

            <!-- Tenure Value & Unit -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="emi-tenure-value" class="form-label">Tenure</label>
                <input
                  id="emi-tenure-value"
                  type="number"
                  formControlName="tenureValue"
                  class="form-input"
                  [class.is-invalid]="isFieldInvalid('tenureValue')"
                  [attr.aria-invalid]="isFieldInvalid('tenureValue')"
                  placeholder="5"
                />
              </div>
              <div>
                <label for="emi-tenure-unit" class="form-label">Unit</label>
                <select id="emi-tenure-unit" formControlName="tenureUnit" class="form-input bg-white">
                  <option value="YEARS">Years</option>
                  <option value="MONTHS">Months</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <button type="submit" [disabled]="loading()" [attr.aria-busy]="loading()" class="btn-primary w-full justify-center pt-3 pb-3 mt-4 cursor-pointer">
              @if (!loading()) {
                <span>Calculate EMI</span>
              } @else {
                <span class="flex items-center gap-2">Calculating...</span>
              }
            </button>
          </form>
        </div>

        <!-- Result Display Section -->
        <div class="lg:col-span-7 space-y-6">
          
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {{ error() }}
            </div>
          }

          @if (result(); as res) {
            <div class="space-y-6">
              
              <!-- Result Primary Metrics -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-blue-600 text-white rounded-2xl p-5 shadow-lg shadow-blue-600/20">
                  <span class="text-xs uppercase font-bold text-blue-200 tracking-wider">Monthly EMI</span>
                  <div class="text-2xl font-extrabold mt-1">₹{{ res.monthlyEmi | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Interest</span>
                  <div class="text-xl font-bold text-slate-900 mt-1">₹{{ res.totalInterest | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Repayment</span>
                  <div class="text-xl font-bold text-slate-900 mt-1">₹{{ res.totalPayment | number:'1.0-0' }}</div>
                </div>
              </div>

              <!-- SVG Donut Chart -->
              <app-simple-chart
                title="Principal vs Interest Breakdown"
                type="donut"
                [pct1]="res.principalPercentage"
                centerLabel="Principal"
                [centerValue]="res.principalPercentage + '%'"
                [legendItems]="[
                  { label: 'Principal Loan Amount', value: '₹' + (res.principalAmount | number:'1.0-0'), percentage: res.principalPercentage, colorClass: 'bg-blue-600' },
                  { label: 'Total Interest Payable', value: '₹' + (res.totalInterest | number:'1.0-0'), percentage: res.interestPercentage, colorClass: 'bg-slate-300' }
                ]"
              ></app-simple-chart>

              <!-- AI Insight Takeaway Card with Lazy Deferring -->
              @defer (on viewport) {
                <app-ai-insight-card [insight]="aiInsight()"></app-ai-insight-card>
              } @placeholder {
                <div class="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
              }

            </div>
          }

          <app-disclaimer-notice></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class EmiCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private calculatorService = inject(CalculatorService);
  private route = inject(ActivatedRoute);

  emiForm!: FormGroup;
  readonly result = signal<EmiResponse | null>(null);
  readonly aiInsight = signal<AiInsightResponse | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.emiForm = this.fb.group({
      principal: [2500000, [Validators.required, Validators.min(1)]],
      annualInterestRate: [8.5, [Validators.required, Validators.min(0)]],
      tenureValue: [5, [Validators.required, Validators.min(1)]],
      tenureUnit: ['YEARS', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      if (params['principal']) {
        this.emiForm.patchValue({
          principal: Number(params['principal']) || 2500000,
          annualInterestRate: Number(params['annualInterestRate']) || 8.5,
          tenureValue: Number(params['tenureValue']) || 5,
          tenureUnit: params['tenureUnit'] || 'YEARS'
        });
      }
      this.calculate();
    });
  }

  isFieldInvalid(field: string): boolean {
    const f = this.emiForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  calculate(): void {
    if (this.emiForm.invalid) {
      this.emiForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    const formVals = this.emiForm.value;

    this.calculatorService.calculateEmi(formVals).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);

        // Fetch AI Decision Insight
        this.calculatorService.getAiInsight({
          calculatorId: 'emi',
          inputData: formVals,
          resultData: res
        }).subscribe(insightRes => {
          this.aiInsight.set(insightRes);
        });
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to calculate EMI.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.emiForm.reset({
      principal: 2500000,
      annualInterestRate: 8.5,
      tenureValue: 5,
      tenureUnit: 'YEARS'
    });
    this.calculate();
  }
}


