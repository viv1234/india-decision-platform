import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { FdResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-fd-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          <span>Fixed Income & Banking</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Fixed Deposit (FD) Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Calculate your total maturity returns and interest earned on bank fixed deposits.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Form -->
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>FD Investment Parameters</span>
            <button (click)="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-semibold underline">Reset</button>
          </h3>

          <form [formGroup]="fdForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label">Principal Deposit Amount</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="principal"
                  class="form-input input-with-rupee"
                  [ngClass]="{'is-invalid': isFieldInvalid('principal')}"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                formControlName="annualInterestRate"
                class="form-input"
                [ngClass]="{'is-invalid': isFieldInvalid('annualInterestRate')}"
                placeholder="7.5"
              />
            </div>

            <div>
              <label class="form-label">Tenure (Years)</label>
              <input
                type="number"
                formControlName="tenureYears"
                class="form-input"
                [ngClass]="{'is-invalid': isFieldInvalid('tenureYears')}"
                placeholder="3"
              />
            </div>

            <div>
              <label class="form-label">Compounding Frequency</label>
              <select formControlName="compoundingFrequency" class="form-input bg-white">
                <option value="QUARTERLY">Quarterly (Standard Bank Default)</option>
                <option value="MONTHLY">Monthly</option>
                <option value="HALF_YEARLY">Half-Yearly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              <span *ngIf="!loading">Calculate Maturity Amount</span>
              <span *ngIf="loading">Calculating...</span>
            </button>
          </form>
        </div>

        <!-- Result Section -->
        <div class="lg:col-span-7 space-y-6">
          
          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
            {{ error }}
          </div>

          <div *ngIf="result" class="space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-blue-600 text-white rounded-2xl p-5 shadow-lg shadow-blue-600/20">
                <span class="text-xs uppercase font-bold text-blue-200 tracking-wider">Maturity Amount</span>
                <div class="text-2xl font-extrabold mt-1">₹{{ result.maturityAmount | number:'1.0-0' }}</div>
              </div>

              <div class="card-saas p-5">
                <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Principal Deposited</span>
                <div class="text-xl font-bold text-slate-900 mt-1">₹{{ result.principal | number:'1.0-0' }}</div>
              </div>

              <div class="card-saas p-5">
                <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Interest Earned</span>
                <div class="text-xl font-bold text-blue-600 mt-1">₹{{ result.interestEarned | number:'1.0-0' }}</div>
              </div>
            </div>

            <app-simple-chart
              title="Deposit vs Guaranteed Interest"
              type="donut"
              [pct1]="round((result.principal / result.maturityAmount) * 100)"
              centerLabel="Yield"
              [centerValue]="round((result.interestEarned / result.principal) * 100) + '% Total'"
              [legendItems]="[
                { label: 'Original Principal', value: '₹' + (result.principal | number:'1.0-0'), percentage: round((result.principal / result.maturityAmount) * 100), colorClass: 'bg-blue-600' },
                { label: 'Compounded Interest', value: '₹' + (result.interestEarned | number:'1.0-0'), percentage: round((result.interestEarned / result.maturityAmount) * 100), colorClass: 'bg-emerald-500' }
              ]"
            ></app-simple-chart>

          </div>

          <app-disclaimer-notice></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class FdCalculatorComponent implements OnInit {
  fdForm!: FormGroup;
  result: FdResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.fdForm = this.fb.group({
      principal: [100000, [Validators.required, Validators.min(1)]],
      annualInterestRate: [7.5, [Validators.required, Validators.min(0)]],
      tenureYears: [3, [Validators.required, Validators.min(1)]],
      compoundingFrequency: ['QUARTERLY', Validators.required]
    });

    this.calculate();
  }

  isFieldInvalid(field: string): boolean {
    const f = this.fdForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  round(val: number): number {
    return Math.round(val);
  }

  calculate(): void {
    if (this.fdForm.invalid) {
      this.fdForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.calculatorService.calculateFd(this.fdForm.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to calculate FD maturity.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.fdForm.reset({
      principal: 100000,
      annualInterestRate: 7.5,
      tenureYears: 3,
      compoundingFrequency: 'QUARTERLY'
    });
    this.calculate();
  }
}
