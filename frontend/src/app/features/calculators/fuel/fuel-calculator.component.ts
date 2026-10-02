import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../../core/services/calculator.service';
import { FuelCostResponse } from '../../../core/models/calculator.model';
import { DisclaimerNoticeComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-fuel-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DisclaimerNoticeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8 border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          <span>Lifestyle & Travel</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Trip Fuel Cost Calculator</h1>
        <p class="text-slate-600 text-sm mt-1">Calculate trip fuel expenses, litres required and per-kilometer travel cost.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-6 card-saas p-6 space-y-5 h-fit">
          <form [formGroup]="fuelForm" (ngSubmit)="calculate()" class="space-y-4">
            
            <div>
              <label class="form-label" for="distanceKm">Total Distance (km)</label>
              <input
                id="distanceKm"
                type="number"
                formControlName="distanceKm"
                class="form-input"
                placeholder="500"
              />
            </div>

            <div>
              <label class="form-label" for="vehicleMileageKmpl">Vehicle Mileage (km / Litre)</label>
              <input
                id="vehicleMileageKmpl"
                type="number"
                step="0.5"
                formControlName="vehicleMileageKmpl"
                class="form-input"
                placeholder="15"
              />
            </div>

            <div>
              <label class="form-label" for="fuelPricePerLitre">Fuel Price (₹ / Litre)</label>
              <div class="relative">
                <span class="rupee-prefix">₹</span>
                <input
                  id="fuelPricePerLitre"
                  type="number"
                  step="0.5"
                  formControlName="fuelPricePerLitre"
                  class="form-input input-with-rupee"
                  placeholder="100"
                />
              </div>
              <span class="text-[11px] text-slate-500 mt-1 block">Manual entry (No live API fetching required).</span>
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full justify-center pt-3 pb-3 mt-4">
              @if (!loading()) {
                <span>Calculate Fuel Expense</span>
              } @else {
                <span>Calculating...</span>
              }
            </button>
          </form>
        </div>

        <div class="lg:col-span-6 space-y-6" aria-live="polite">
          @if (result(); as res) {
            <div class="space-y-4">
              
              <div class="bg-blue-600 text-white rounded-2xl p-6 shadow-lg shadow-blue-600/20 text-center">
                <span class="text-xs uppercase font-extrabold text-blue-200 tracking-wider">Total Estimated Trip Cost</span>
                <div class="text-4xl font-extrabold mt-1">₹{{ res.estimatedFuelCost | number:'1.2-2' }}</div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="card-saas p-4 text-center">
                  <span class="text-xs uppercase font-bold text-slate-500">Fuel Required</span>
                  <div class="text-lg font-bold text-slate-900 mt-1">{{ res.fuelRequiredLitres | number:'1.1-2' }} L</div>
                </div>
                <div class="card-saas p-4 text-center">
                  <span class="text-xs uppercase font-bold text-slate-500">Expense Per Km</span>
                  <div class="text-lg font-bold text-slate-900 mt-1">₹{{ res.costPerKm | number:'1.2-2' }} / km</div>
                </div>
              </div>

            </div>
          }

          <app-disclaimer-notice customText="Fuel consumption varies based on traffic conditions, driving style and vehicle condition. Figures are estimates."></app-disclaimer-notice>
        </div>

      </div>
    </div>
  `
})
export class FuelCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private calculatorService = inject(CalculatorService);

  fuelForm!: FormGroup;
  result = signal<FuelCostResponse | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.fuelForm = this.fb.group({
      distanceKm: [500, [Validators.required, Validators.min(1)]],
      vehicleMileageKmpl: [15, [Validators.required, Validators.min(1)]],
      fuelPricePerLitre: [100, [Validators.required, Validators.min(1)]]
    });

    this.calculate();
  }

  calculate(): void {
    if (this.fuelForm.invalid) return;
    this.loading.set(true);

    this.calculatorService.calculateFuelCost(this.fuelForm.value).subscribe({
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

