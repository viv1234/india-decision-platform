import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { RentAffordabilityResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-rent-affordability-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          <span>Housing & Lifestyle Budget</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Rent Affordability Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Evaluate your monthly rent budget against household income, existing EMIs, and monthly obligations.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <form [formGroup]="rentForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label">Total Monthly Household Income</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="monthlyIncome"
                  class="form-input input-with-rupee"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Target Monthly Rent</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="monthlyRent"
                  class="form-input input-with-rupee"
                  placeholder="25000"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Existing Monthly EMIs (Loans)</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="existingMonthlyEmi"
                  class="form-input input-with-rupee"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Other Essential Monthly Expenses</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="otherMonthlyExpenses"
                  class="form-input input-with-rupee"
                  placeholder="15000"
                />
              </div>
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              <span *ngIf="!loading">Evaluate Rent Affordability</span>
              <span *ngIf="loading">Calculating...</span>
            </button>
          </form>
        </div>

        <div class="lg:col-span-7 space-y-6">
          <div *ngIf="result" class="space-y-6">
            
            <!-- Affordability Status Banner -->
            <div
              class="rounded-2xl p-6 text-white shadow-lg flex items-center justify-between"
              [ngClass]="{
                'bg-emerald-600 shadow-emerald-600/20': result.affordabilityBadgeColor === 'green',
                'bg-amber-600 shadow-amber-600/20': result.affordabilityBadgeColor === 'yellow',
                'bg-red-600 shadow-red-600/20': result.affordabilityBadgeColor === 'red'
              }"
            >
              <div>
                <span class="text-xs font-bold uppercase tracking-wider opacity-80">Affordability Verdict</span>
                <div class="text-2xl font-extrabold mt-1">{{ result.affordabilityStatus }}</div>
                <p class="text-xs text-white/90 mt-2 max-w-md leading-relaxed">{{ result.recommendation }}</p>
              </div>
              <div class="text-3xl">
                <span *ngIf="result.affordabilityBadgeColor === 'green'">✅</span>
                <span *ngIf="result.affordabilityBadgeColor === 'yellow'">⚠️</span>
                <span *ngIf="result.affordabilityBadgeColor === 'red'">🚨</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="card-saas p-4">
                <span class="text-xs uppercase font-bold text-slate-500">Rent to Income</span>
                <div class="text-xl font-bold text-slate-900 mt-1">{{ result.rentToIncomeRatio | number:'1.1-1' }}%</div>
              </div>
              <div class="card-saas p-4">
                <span class="text-xs uppercase font-bold text-slate-500">Total Expense Ratio</span>
                <div class="text-xl font-bold text-slate-900 mt-1">{{ result.totalExpenseRatio | number:'1.1-1' }}%</div>
              </div>
              <div class="card-saas p-4">
                <span class="text-xs uppercase font-bold text-emerald-600">Remaining Savings</span>
                <div class="text-xl font-bold text-emerald-600 mt-1">₹{{ result.remainingMonthlyIncome | number:'1.0-0' }}</div>
              </div>
            </div>

            <app-simple-chart
              title="Monthly Obligations Budget Distribution"
              type="bar"
              [barItems]="[
                { label: 'Proposed Rent', displayValue: '₹' + (result.monthlyRent | number:'1.0-0'), percentage: result.rentToIncomeRatio, colorClass: 'bg-blue-600' },
                { label: 'Existing Loan EMIs', displayValue: '₹' + (rentForm.get('existingMonthlyEmi')?.value | number:'1.0-0'), percentage: ((rentForm.get('existingMonthlyEmi')?.value || 0) / result.monthlyIncome) * 100, colorClass: 'bg-amber-500' },
                { label: 'Remaining Disposable Savings', displayValue: '₹' + (result.remainingMonthlyIncome | number:'1.0-0'), percentage: (result.remainingMonthlyIncome / result.monthlyIncome) * 100, colorClass: 'bg-emerald-500' }
              ]"
            ></app-simple-chart>

          </div>

          <app-disclaimer-notice [customText]="result?.disclaimer || 'This is a budgeting indication for financial planning, not legal or financial advice.'"></app-disclaimer-notice>
        </div>

      </div>
    </div>
  `
})
export class RentAffordabilityCalculatorComponent implements OnInit {
  rentForm!: FormGroup;
  result: RentAffordabilityResponse | null = null;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.rentForm = this.fb.group({
      monthlyIncome: [100000, [Validators.required, Validators.min(1)]],
      monthlyRent: [25000, [Validators.required, Validators.min(0)]],
      existingMonthlyEmi: [10000, [Validators.min(0)]],
      otherMonthlyExpenses: [15000, [Validators.min(0)]]
    });

    this.calculate();
  }

  calculate(): void {
    if (this.rentForm.invalid) return;
    this.loading = true;

    this.calculatorService.calculateRentAffordability(this.rentForm.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
