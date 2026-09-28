import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { DiscountResponse } from '../../../core/models/calculator.model';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-discount-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DisclaimerNoticeComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3">
          <span>Shopping & Savings</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Discount Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Quickly find out your final price after applying store discounts and total money saved.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-6 card-saas p-6 space-y-5 h-fit">
          <form [formGroup]="discountForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label">Original Price</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  type="number"
                  formControlName="originalPrice"
                  class="form-input input-with-rupee"
                  placeholder="2499"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Discount Percentage (%)</label>
              <div class="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  *ngFor="let pct of discountPresets"
                  (click)="setDiscount(pct)"
                  class="px-3 py-1 text-xs font-bold rounded-lg border transition-all"
                  [ngClass]="discountForm.get('discountPercentage')?.value === pct ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'"
                >
                  {{ pct }}% Off
                </button>
              </div>
              <input
                type="number"
                step="0.5"
                formControlName="discountPercentage"
                class="form-input"
                placeholder="20"
              />
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              <span *ngIf="!loading">Calculate Savings</span>
              <span *ngIf="loading">Calculating...</span>
            </button>
          </form>
        </div>

        <div class="lg:col-span-6 space-y-6">
          <div *ngIf="result" class="space-y-4">
            
            <div class="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg shadow-emerald-600/20 text-center">
              <span class="text-xs uppercase font-extrabold text-emerald-200 tracking-wider">Final Price After Discount</span>
              <div class="text-4xl font-extrabold mt-1">₹{{ result.finalPrice | number:'1.2-2' }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="card-saas p-4 text-center">
                <span class="text-xs uppercase font-bold text-slate-500">Original Price</span>
                <div class="text-lg font-bold text-slate-900 mt-1">₹{{ result.originalPrice | number:'1.2-2' }}</div>
              </div>
              <div class="card-saas p-4 text-center">
                <span class="text-xs uppercase font-bold text-emerald-600">Total Money Saved</span>
                <div class="text-lg font-bold text-emerald-600 mt-1">₹{{ result.amountSaved | number:'1.2-2' }}</div>
              </div>
            </div>

          </div>

          <app-disclaimer-notice></app-disclaimer-notice>
        </div>

      </div>
    </div>
  `
})
export class DiscountCalculatorComponent implements OnInit {
  discountForm!: FormGroup;
  result: DiscountResponse | null = null;
  loading: boolean = false;
  discountPresets = [10, 15, 20, 25, 50];

  constructor(private fb: FormBuilder, private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.discountForm = this.fb.group({
      originalPrice: [2499, [Validators.required, Validators.min(1)]],
      discountPercentage: [20, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.calculate();
  }

  setDiscount(pct: number): void {
    this.discountForm.patchValue({ discountPercentage: pct });
    this.calculate();
  }

  calculate(): void {
    if (this.discountForm.invalid) return;
    this.loading = true;

    this.calculatorService.calculateDiscount(this.discountForm.value).subscribe({
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
