import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { InflationResponse } from '../../../core/models/calculator.model';
import { SimpleChartComponent } from '../../../shared/components/simple-chart/simple-chart.component';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-inflation-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleChartComponent, DisclaimerNoticeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-3">
          <span>Economy & Cost of Living</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Inflation & Purchasing Power Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Evaluate how future inflation erodes purchasing power and increases the future cost of living.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-5 card-saas p-6 space-y-5 h-fit">
          <form [formGroup]="inflationForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label" for="currentAmount">Current Expenses / Capital</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  id="currentAmount"
                  type="number"
                  formControlName="currentAmount"
                  class="form-input input-with-rupee"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label class="form-label" for="inflationRate">Annual Inflation Rate (%)</label>
              <input
                id="inflationRate"
                type="number"
                step="0.1"
                formControlName="inflationRate"
                class="form-input"
                placeholder="6.0"
              />
            </div>

            <div>
              <label class="form-label" for="years">Number of Years</label>
              <input
                id="years"
                type="number"
                formControlName="years"
                class="form-input"
                placeholder="10"
              />
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              @if (!loading()) {
                <span>Calculate Purchasing Power</span>
              } @else {
                <span>Calculating...</span>
              }
            </button>
          </form>
        </div>

        <div class="lg:col-span-7 space-y-6" aria-live="polite">
          @if (result(); as res) {
            <div class="space-y-6">
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-red-600 text-white rounded-2xl p-5 shadow-lg shadow-red-600/20">
                  <span class="text-xs uppercase font-bold text-red-200 tracking-wider">Future Cost Equivalent</span>
                  <div class="text-2xl font-extrabold mt-1">₹{{ res.futureEquivalentAmount | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Present Purchasing Value</span>
                  <div class="text-xl font-bold text-slate-900 mt-1">₹{{ res.purchasingPowerEquivalent | number:'1.0-0' }}</div>
                </div>

                <div class="card-saas p-5">
                  <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Purchasing Power Loss</span>
                  <div class="text-xl font-bold text-red-600 mt-1">{{ res.purchasingPowerLossPercentage | number:'1.1-1' }}%</div>
                </div>
              </div>

              <app-simple-chart
                title="Purchasing Power Erosion Impact"
                type="bar"
                [barItems]="[
                  { label: 'Current Purchasing Power', displayValue: '₹' + (res.currentAmount | number:'1.0-0'), percentage: 100, colorClass: 'bg-blue-600' },
                  { label: 'Purchasing Value in ' + res.years + ' Years', displayValue: '₹' + (res.purchasingPowerEquivalent | number:'1.0-0'), percentage: (res.purchasingPowerEquivalent / res.currentAmount) * 100, colorClass: 'bg-red-500' }
                ]"
              ></app-simple-chart>

            </div>
          }

          <app-disclaimer-notice [customText]="result()?.disclaimer || 'Calculated figures are estimates based on constant historical compounding.'"></app-disclaimer-notice>
        </div>

      </div>
    </div>
  `
})
export class InflationCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private calculatorService = inject(CalculatorService);

  inflationForm!: FormGroup;
  result = signal<InflationResponse | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.inflationForm = this.fb.group({
      currentAmount: [100000, [Validators.required, Validators.min(1)]],
      inflationRate: [6.0, [Validators.required, Validators.min(0)]],
      years: [10, [Validators.required, Validators.min(1)]]
    });

    this.calculate();
  }

  calculate(): void {
    if (this.inflationForm.invalid) return;
    this.loading.set(true);

    this.calculatorService.calculateInflation(this.inflationForm.value).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

