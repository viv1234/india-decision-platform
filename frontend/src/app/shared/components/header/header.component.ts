import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2.5 text-slate-900 font-bold text-xl group">
          <div class="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-extrabold shadow-md shadow-blue-500/20 group-hover:bg-blue-800 transition-all">
            ₹
          </div>
          <div class="flex flex-col">
            <span class="leading-tight tracking-tight">Bharat<span class="text-blue-600">Decision</span></span>
            <span class="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">India Decision Engine</span>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a routerLink="/" routerLinkActive="text-blue-600 font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-slate-900 transition-colors">Home</a>
          <a routerLink="/dashboard" routerLinkActive="text-blue-600 font-bold" class="hover:text-slate-900 transition-colors">All Calculators</a>
          <a routerLink="/calculators/emi" class="hover:text-slate-900 transition-colors">EMI</a>
          <a routerLink="/calculators/sip" class="hover:text-slate-900 transition-colors">SIP</a>
          <a routerLink="/calculators/salary" class="hover:text-slate-900 transition-colors">Salary / CTC</a>
          <a routerLink="/calculators/gst" class="hover:text-slate-900 transition-colors">GST</a>
        </nav>

        <!-- Right Action Button (AI Assistant Preview) -->
        <div class="flex items-center gap-3">
          <button (click)="openAiModal.emit()" class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm shadow-amber-500/20 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Ask AI Assistant</span>
            <span class="hidden sm:inline bg-amber-700/40 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">Live</span>
          </button>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() openAiModal = new EventEmitter<void>();
}
