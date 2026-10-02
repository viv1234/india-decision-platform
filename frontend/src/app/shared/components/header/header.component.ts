import { Component, output, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/" (click)="mobileMenuOpen.set(false)" class="flex items-center gap-2.5 text-slate-900 font-bold text-xl group">
          <div class="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-extrabold shadow-md shadow-blue-500/20 group-hover:bg-blue-800 transition-all">
            ₹
          </div>
          <div class="flex flex-col">
            <span class="leading-tight tracking-tight">Bharat<span class="text-blue-600">Decision</span></span>
            <span class="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">India Decision Engine</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a routerLink="/" routerLinkActive="text-blue-600 font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-slate-900 transition-colors">Home</a>
          <a routerLink="/dashboard" routerLinkActive="text-blue-600 font-bold" class="hover:text-slate-900 transition-colors">All Calculators</a>
          <a routerLink="/calculators/emi" class="hover:text-slate-900 transition-colors">EMI</a>
          <a routerLink="/calculators/sip" class="hover:text-slate-900 transition-colors">SIP</a>
          <a routerLink="/calculators/salary" class="hover:text-slate-900 transition-colors">Salary / CTC</a>
          <a routerLink="/calculators/gst" class="hover:text-slate-900 transition-colors">GST</a>
        </nav>

        <!-- Right Action Button & Mobile Hamburger Toggle -->
        <div class="flex items-center gap-2 sm:gap-3">
          <button (click)="triggerAiModal()" class="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-3.5 sm:py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm shadow-amber-500/20 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Ask AI</span>
            <span class="hidden sm:inline bg-amber-700/40 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">Live</span>
          </button>

          <!-- Mobile Hamburger Toggle Button -->
          <button
            (click)="toggleMobileMenu()"
            type="button"
            class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (!mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              }
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile Navigation Dropdown Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-lg">
          <a
            routerLink="/"
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-blue-50 text-blue-700 font-bold"
            [routerLinkActiveOptions]="{exact: true}"
            class="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            🏠 Home
          </a>
          <a
            routerLink="/dashboard"
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-blue-50 text-blue-700 font-bold"
            class="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            📊 All Calculators (10 Tools)
          </a>
          <div class="pt-2 border-t border-slate-100 space-y-1">
            <span class="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Popular Calculators</span>
            <a routerLink="/calculators/emi" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">💰 Loan EMI Calculator</a>
            <a routerLink="/calculators/sip" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">📈 SIP Investment Calculator</a>
            <a routerLink="/calculators/salary" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">💼 Salary / CTC Calculator</a>
            <a routerLink="/calculators/gst" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">🧾 GST Tax Calculator</a>
            <a routerLink="/calculators/fd" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">🏦 Fixed Deposit (FD)</a>
            <a routerLink="/calculators/rent-affordability" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">🏠 Rent Affordability</a>
          </div>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  readonly openAiModal = output<void>();
  readonly mobileMenuOpen = signal<boolean>(false);
  private analyticsService = inject(AnalyticsService);

  triggerAiModal(): void {
    this.analyticsService.trackCtaClick('header_ask_ai');
    this.openAiModal.emit();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}


