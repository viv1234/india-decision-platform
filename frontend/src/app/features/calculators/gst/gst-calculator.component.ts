import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { GstResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-gst-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3">
          <span>Taxation & Shopping</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">GST Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Compute CGST, SGST and total billing price for Goods and Services Tax inclusive and exclusive rates.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Form -->
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>GST Amount & Rate</span>
            <button (click)="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-semibold underline">Reset</button>
          </h3>

          <form [formGroup]="gstForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label">Transaction Amount</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="amount"
                  class="form-input input-with-rupee"
                  [ngClass]="{'is-invalid': isFieldInvalid('amount')}"
                  placeholder="10000"
                />
              </div>
            </div>

            <!-- GST Rate Presets -->
            <div>
              <label class="form-label">GST Percentage Rate (%)</label>
              <div class="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  *ngFor="let rate of presetRates"
                  (click)="setRate(rate)"
                  class="px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer"
                  [ngClass]="gstForm.get('gstPercentage')?.value === rate ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                >
                  {{ rate }}%
                </button>
              </div>
              <input
                type="number"
                step="0.1"
                formControlName="gstPercentage"
                class="form-input"
                [ngClass]="{'is-invalid': isFieldInvalid('gstPercentage')}"
                placeholder="18"
              />
            </div>

            <!-- Inclusive / Exclusive Toggle -->
            <div>
              <label class="form-label">GST Calculation Type</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  (click)="setInclusive(false)"
                  class="py-2.5 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer"
                  [ngClass]="!gstForm.get('inclusive')?.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'"
                >
                  GST Exclusive (Add Tax)
                </button>
                <button
                  type="button"
                  (click)="setInclusive(true)"
                  class="py-2.5 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer"
                  [ngClass]="gstForm.get('inclusive')?.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'"
                >
                  GST Inclusive (Remove Tax)
                </button>
              </div>
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              <span *ngIf="!loading">Calculate GST</span>
              <span *ngIf="loading">Calculating...</span>
            </button>
          </form>
        </div>

        <!-- Result -->
        <div class="lg:col-span-7 space-y-6">
          
          <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
            {{ error }}
          </div>

          <div *ngIf="result" class="space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-amber-600 text-white rounded-2xl p-5 shadow-lg shadow-amber-600/20">
                <span class="text-xs uppercase font-bold text-amber-100 tracking-wider">Final Billing Amount</span>
                <div class="text-2xl font-extrabold mt-1">₹{{ result.finalAmount | number:'1.2-2' }}</div>
              </div>

              <div class="card-saas p-5">
                <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Net Base Amount</span>
                <div class="text-xl font-bold text-slate-900 mt-1">₹{{ result.baseAmount | number:'1.2-2' }}</div>
              </div>

              <div class="card-saas p-5">
                <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Total GST Tax</span>
                <div class="text-xl font-bold text-amber-600 mt-1">₹{{ result.gstAmount | number:'1.2-2' }}</div>
              </div>
            </div>

            <!-- Tax split details -->
            <div class="card-saas p-6 space-y-3">
              <h4 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">CGST & SGST Split</h4>
              <div class="flex justify-between text-xs py-1 border-b border-slate-100">
                <span class="text-slate-600">Central GST (CGST {{ result.gstPercentage / 2 }}%):</span>
                <span class="font-bold text-slate-900">₹{{ result.cgst | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-xs py-1 border-b border-slate-100">
                <span class="text-slate-600">State GST (SGST {{ result.gstPercentage / 2 }}%):</span>
                <span class="font-bold text-slate-900">₹{{ result.sgst | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-xs py-1 font-bold pt-2 text-amber-700">
                <span>Total Combined GST ({{ result.gstPercentage }}%):</span>
                <span>₹{{ result.gstAmount | number:'1.2-2' }}</span>
              </div>
            </div>

            <app-simple-chart
              title="Base Cost vs Tax Percentage Share"
              type="bar"
              [barItems]="[
                { label: 'Net Product/Service Base', displayValue: '₹' + (result.baseAmount | number:'1.2-2'), percentage: (result.baseAmount / result.finalAmount) * 100, colorClass: 'bg-blue-600' },
                { label: 'CGST (Central Tax)', displayValue: '₹' + (result.cgst | number:'1.2-2'), percentage: (result.cgst / result.finalAmount) * 100, colorClass: 'bg-amber-500' },
                { label: 'SGST (State Tax)', displayValue: '₹' + (result.sgst | number:'1.2-2'), percentage: (result.sgst / result.finalAmount) * 100, colorClass: 'bg-amber-600' }
              ]"
            ></app-simple-chart>

          </div>

          <app-disclaimer-notice></app-disclaimer-notice>

        </div>

      </div>
    </div>
  `
})
export class GstCalculatorComponent implements OnInit {
  gstForm!: FormGroup;
  result: GstResponse | null = null;
  loading: boolean = false;
  error: string | null = null;
  presetRates = [5, 12, 18, 28];

  constructor(private fb: FormBuilder, private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.gstForm = this.fb.group({
      amount: [10000, [Validators.required, Validators.min(1)]],
      gstPercentage: [18, [Validators.required, Validators.min(0.1)]],
      inclusive: [false]
    });

    this.calculate();
  }

  isFieldInvalid(field: string): boolean {
    const f = this.gstForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  setRate(rate: number): void {
    this.gstForm.patchValue({ gstPercentage: rate });
    this.calculate();
  }

  setInclusive(inc: boolean): void {
    this.gstForm.patchValue({ inclusive: inc });
    this.calculate();
  }

  calculate(): void {
    if (this.gstForm.invalid) {
      this.gstForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.calculatorService.calculateGst(this.gstForm.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to calculate GST.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.gstForm.reset({
      amount: 10000,
      gstPercentage: 18,
      inclusive: false
    });
    this.calculate();
  }
}
