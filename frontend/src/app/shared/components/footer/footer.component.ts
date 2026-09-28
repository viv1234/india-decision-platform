import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">₹</div>
              <span>BharatDecision</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              AI-ready decision platform helping Indian consumers calculate, compare and understand everyday financial and lifestyle metrics.
            </p>
            <div class="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">
              <span>🇮🇳 Built for Indian Citizens</span>
            </div>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Financial Calculators</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/calculators/emi" class="hover:text-white transition-colors">Loan EMI Calculator</a></li>
              <li><a routerLink="/calculators/sip" class="hover:text-white transition-colors">SIP Investment Calculator</a></li>
              <li><a routerLink="/calculators/fd" class="hover:text-white transition-colors">FD Maturity Calculator</a></li>
              <li><a routerLink="/calculators/salary" class="hover:text-white transition-colors">Salary & CTC In-Hand</a></li>
              <li><a routerLink="/calculators/rent-affordability" class="hover:text-white transition-colors">Rent Affordability</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Utilities & Shopping</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/calculators/gst" class="hover:text-white transition-colors">GST Tax Calculator</a></li>
              <li><a routerLink="/calculators/discount" class="hover:text-white transition-colors">Discount & Savings</a></li>
              <li><a routerLink="/calculators/percentage" class="hover:text-white transition-colors">Percentage Calculator</a></li>
              <li><a routerLink="/calculators/fuel" class="hover:text-white transition-colors">Trip Fuel Cost</a></li>
              <li><a routerLink="/calculators/inflation" class="hover:text-white transition-colors">Inflation & Purchasing Power</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Platform Disclaimer</h4>
            <p class="text-[11px] text-slate-400 leading-normal">
              Calculations provided by this platform are for informational and educational purposes only. Results may vary based on actual rates, rules, fees, employer policies and individual circumstances. Please verify important financial, tax or legal information with relevant official sources.
            </p>
          </div>

        </div>

        <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 BharatDecision Platform (Phase 1 Foundation). All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span class="text-slate-400">Low-Cost Calculation Engine</span>
            <span>REST API Source of Truth</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
