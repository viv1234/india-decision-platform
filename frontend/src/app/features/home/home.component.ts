import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalculatorCardComponent } from '../../shared/components/calculator-card/calculator-card.component';
import { DisclaimerNoticeComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { CalculatorService } from '../../core/services/calculator.service';
import { CalculatorMetadata } from '../../core/models/calculator.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CalculatorCardComponent, DisclaimerNoticeComponent],
  template: `
    <div>
      <!-- HERO SECTION -->
      <section class="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        <!-- Background Glow -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center relative z-10">
          
          <div class="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 mb-6 backdrop-blur-md">
            <span>🚀 Phase 1 Foundation Live</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            Make Better Decisions with <span class="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">Numbers</span>
          </h1>

          <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Calculate, compare and understand your everyday financial decisions with high precision and transparent breakdowns.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/dashboard" class="btn-primary text-base py-3.5 px-8 shadow-lg shadow-blue-600/30 w-full sm:w-auto">
              Explore Calculators
            </a>
            <a routerLink="/calculators/emi" class="btn-secondary text-base py-3.5 px-8 w-full sm:w-auto">
              Try EMI Calculator
            </a>
          </div>

          <!-- Feature Bullets -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-slate-800 text-left text-xs text-slate-400">
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-md bg-blue-900/60 text-blue-400 flex items-center justify-center font-bold">✓</span>
              <span>100% Free & Low-Cost</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-md bg-blue-900/60 text-blue-400 flex items-center justify-center font-bold">✓</span>
              <span>Backend Source of Truth</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-md bg-blue-900/60 text-blue-400 flex items-center justify-center font-bold">✓</span>
              <span>Tailored for India Rules</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-md bg-blue-900/60 text-blue-400 flex items-center justify-center font-bold">✓</span>
              <span>AI-Ready Architecture</span>
            </div>
          </div>

        </div>
      </section>

      <!-- POPULAR CALCULATORS SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-20">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Popular Calculators</h2>
            <p class="text-sm text-slate-500">Most requested decision tools for everyday life</p>
          </div>
          <a routerLink="/dashboard" class="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All (10)</span>
            <span>→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-calculator-card
            *ngFor="let calc of popularCalculators"
            [id]="calc.id"
            [name]="calc.name"
            [category]="calc.category"
            [description]="calc.description"
            [icon]="calc.icon"
            [route]="calc.route"
          ></app-calculator-card>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div class="max-w-7xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">How BharatDecision Works</h2>
            <p class="text-slate-600 text-sm">Designed with an intuitive Goal → Calculate → Explain workflow</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card-saas p-6 text-center">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                1
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-2">Input Your Real Values</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Enter your loan principal, CTC salary, rent budget or investment amount into validated reactive forms.
              </p>
            </div>

            <div class="card-saas p-6 text-center">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                2
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-2">Backend Calculation Engine</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Spring Boot REST services perform server-side calculations ensuring 100% accuracy and standardized source of truth.
              </p>
            </div>

            <div class="card-saas p-6 text-center">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                3
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-2">Visual Breakdown & Rationale</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Get clear visual charts, amortization schedules, and plain-language affordability indications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY THIS PLATFORM -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div class="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div class="max-w-3xl relative z-10">
            <span class="badge badge-yellow mb-4">Platform Vision</span>
            <h2 class="text-2xl sm:text-3xl font-bold mb-4">
              Building the Future of Indian Financial Decision Support
            </h2>
            <p class="text-slate-300 text-sm leading-relaxed mb-6">
              Instead of navigating dozens of cluttered sites with ad-heavy calculators, BharatDecision combines goal parsing, exact mathematics, and transparent explanations into a single unified engine.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-200">
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-base">✓</span>
                <span>No hidden fees or paid subscriptions</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-base">✓</span>
                <span>Zero external expensive API dependencies</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-base">✓</span>
                <span>Fast response times under 50ms</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-base">✓</span>
                <span>Modular Spring Boot & Angular stack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DISCLAIMER CONTAINER -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <app-disclaimer-notice></app-disclaimer-notice>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  popularCalculators: CalculatorMetadata[] = [];

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.calculatorService.getCalculators().subscribe({
      next: (list) => {
        this.popularCalculators = list.slice(0, 6);
      },
      error: () => {
        // Fallback default list if backend connecting
        this.popularCalculators = [
          { id: 'emi', name: 'EMI Calculator', category: 'Loans', description: 'Calculate monthly loan EMI and total interest.', icon: 'calculator', route: '/calculators/emi', active: true },
          { id: 'sip', name: 'SIP Calculator', category: 'Finance', description: 'Estimate wealth accumulation through mutual fund SIPs.', icon: 'trending-up', route: '/calculators/sip', active: true },
          { id: 'fd', name: 'Fixed Deposit (FD)', category: 'Finance', description: 'Calculate guaranteed maturity returns and interest earned.', icon: 'piggy-bank', route: '/calculators/fd', active: true },
          { id: 'salary', name: 'Salary / CTC Calculator', category: 'Salary', description: 'Estimate monthly take-home salary and total deductions.', icon: 'briefcase', route: '/calculators/salary', active: true },
          { id: 'gst', name: 'GST Calculator', category: 'Shopping', description: 'Compute CGST, SGST and total price for GST rates.', icon: 'receipt', route: '/calculators/gst', active: true },
          { id: 'rent-affordability', name: 'Rent Affordability', category: 'Loans', description: 'Evaluate rent budget against income and existing EMIs.', icon: 'home', route: '/calculators/rent-affordability', active: true }
        ];
      }
    });
  }
}
