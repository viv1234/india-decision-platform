import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { SalaryResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-salary-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full mb-3">
          <span>Income & Employment</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Salary / CTC Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Estimate your monthly in-hand take home salary and statutory deductions from annual Cost to Company (CTC).</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Input Form -->
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>CTC & Salary Inputs</span>
            <button (click)="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-semibold underline">Reset</button>
          </h3>

          <form [formGroup]="salaryForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label" for="annualCtc">Annual Cost to Company (CTC)</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  id="annualCtc"
                  type="number"
                  formControlName="annualCtc"
                  class="form-input input-with-rupee"
                  [ngClass]="{'is-invalid': isFieldInvalid('annualCtc')}"
                  placeholder="1200000"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label" for="professionalTaxMonthly">Prof. Tax (Monthly)</label>
                <div class="relative">
                  <span class="rupee-prefix">₹</span>
                  <input
                    id="professionalTaxMonthly"
                    type="number"
                    formControlName="professionalTaxMonthly"
                    class="form-input input-with-rupee"
                  />
                </div>
              </div>

              <div>
                <label class="form-label" for="otherDeductionsMonthly">Other Deductions</label>
                <div class="relative">
                  <span class="rupee-prefix">₹</span>
                  <input
                    id="otherDeductionsMonthly"
                    type="number"
                    formControlName="otherDeductionsMonthly"
                    class="form-input input-with-rupee"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              @if (!loading()) {
                <span>Calculate Take-Home Salary</span>
              } @else {
                <span>Calculating...</span>
              }
            </button>
          </form>
        </div>

        <!-- Result Section -->
        <div class="lg:col-span-7 space-y-6" aria-live="polite">
          
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {{ error() }}
            </div>
          }

          @if (result(); as res) {
            <div class="space-y-6">
              
              <!-- Result Primary Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-purple-700 text-white rounded-2xl p-5 shadow-lg shadow-purple-700/20">
                  <span class="text-xs uppercase font-bold text-purple-200 tracking-wider">Monthly In-Hand</span>
                  <div class="text-2xl font-extrabold mt-1">₹{{ res.estimatedMonthlyInHand | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Monthly Gross</span>
                  <div class="text-xl font-bold text-slate-900 mt-1">₹{{ res.monthlyGross | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Monthly Deductions</span>
                  <div class="text-xl font-bold text-red-600 mt-1">₹{{ res.totalMonthlyDeductions | number:'1.0-0' }}</div>
                </div>
              </div>

              <!-- Breakdown Table -->
              <div class="card-saas p-6 space-y-3">
                <h4 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Annual & Monthly Breakdown</h4>
                <div class="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span class="text-slate-600">Annual Gross CTC:</span>
                  <span class="font-bold text-slate-900">₹{{ res.annualCtc | number:'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span class="text-slate-600">Employee Provident Fund (PF):</span>
                  <span class="font-bold text-slate-900">₹{{ res.monthlyPfDeduction | number:'1.0-0' }} / mo</span>
                </div>
                <div class="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span class="text-slate-600">Professional Tax (PT):</span>
                  <span class="font-bold text-slate-900">₹{{ res.monthlyProfessionalTax | number:'1.0-0' }} / mo</span>
                </div>
                <div class="flex justify-between text-xs py-1 font-bold pt-2 text-purple-700">
                  <span>Estimated Annual Take-Home:</span>
                  <span>₹{{ res.annualInHand | number:'1.0-0' }}</span>
                </div>
              </div>

              <app-simple-chart
                title="Gross CTC vs Take-Home Salary Composition"
                type="bar"
                [barItems]="[
                  { label: 'Take-Home Salary (In-Hand)', displayValue: '₹' + (res.estimatedMonthlyInHand | number:'1.0-0') + '/mo', percentage: (res.estimatedMonthlyInHand / res.monthlyGross) * 100, colorClass: 'bg-purple-600' },
                  { label: 'Provident Fund (PF)', displayValue: '₹' + (res.monthlyPfDeduction | number:'1.0-0') + '/mo', percentage: (res.monthlyPfDeduction / res.monthlyGross) * 100, colorClass: 'bg-blue-500' },
                  { label: 'Professional Tax & Other', displayValue: '₹' + (res.monthlyProfessionalTax + res.monthlyOtherDeductions | number:'1.0-0') + '/mo', percentage: ((res.monthlyProfessionalTax + res.monthlyOtherDeductions) / res.monthlyGross) * 100, colorClass: 'bg-amber-500' }
                ]"
              ></app-simple-chart>

            </div>
          }

          <app-disclaimer-notice [customText]="result()?.disclaimer || 'Estimated calculation. Actual salary depends on employer structure, tax regime and applicable rules.'"></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class SalaryCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private calculatorService = inject(CalculatorService);

  salaryForm!: FormGroup;
  result = signal<SalaryResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.salaryForm = this.fb.group({
      annualCtc: [1200000, [Validators.required, Validators.min(1)]],
      professionalTaxMonthly: [200, [Validators.min(0)]],
      otherDeductionsMonthly: [0, [Validators.min(0)]]
    });

    this.calculate();
  }

  isFieldInvalid(field: string): boolean {
    const f = this.salaryForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  calculate(): void {
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.calculatorService.calculateSalary(this.salaryForm.value).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to calculate salary breakdown.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.salaryForm.reset({
      annualCtc: 1200000,
      professionalTaxMonthly: 200,
      otherDeductionsMonthly: 0
    });
    this.calculate();
  }
}

