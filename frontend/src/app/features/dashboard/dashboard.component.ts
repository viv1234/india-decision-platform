import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalculatorCardComponent } from '../../shared/components/calculator-card/calculator-card.component';
import { CalculatorService } from '../../core/services/calculator.service';
import { CalculatorMetadata } from '../../core/models/calculator.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CalculatorCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Calculator Directory</h1>
        <p class="text-slate-600 text-sm">Explore all 10 specialized financial and decision calculators available on the platform.</p>
      </div>

      <!-- Filter Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200">
        @for (cat of categories; track cat) {
          <button
            (click)="selectedCategory.set(cat)"
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer"
            [class]="selectedCategory() === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Calculators Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (calc of filteredCalculators(); track calc.id) {
          <app-calculator-card
            [id]="calc.id"
            [name]="calc.name"
            [category]="calc.category"
            [description]="calc.description"
            [icon]="calc.icon"
            [route]="calc.route"
          ></app-calculator-card>
        }
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  readonly calculators = signal<CalculatorMetadata[]>([]);
  readonly selectedCategory = signal<string>('All');
  readonly categories: string[] = ['All', 'Finance', 'Salary', 'Loans', 'Shopping', 'Lifestyle'];

  private calculatorService = inject(CalculatorService);

  readonly filteredCalculators = computed(() => {
    const cat = this.selectedCategory();
    const list = this.calculators();
    if (cat === 'All') {
      return list;
    }
    return list.filter(c => c.category.toLowerCase() === cat.toLowerCase());
  });

  ngOnInit(): void {
    this.calculatorService.getCalculators().subscribe({
      next: (data) => {
        this.calculators.set(data);
      },
      error: () => {
        // Fallback default list
        this.calculators.set([
          { id: 'emi', name: 'EMI Calculator', category: 'Loans', description: 'Calculate monthly loan EMI and total interest.', icon: 'calculator', route: '/calculators/emi', active: true },
          { id: 'sip', name: 'SIP Calculator', category: 'Finance', description: 'Estimate wealth accumulation through mutual fund SIPs.', icon: 'trending-up', route: '/calculators/sip', active: true },
          { id: 'fd', name: 'Fixed Deposit (FD)', category: 'Finance', description: 'Calculate guaranteed maturity returns and interest earned.', icon: 'piggy-bank', route: '/calculators/fd', active: true },
          { id: 'salary', name: 'Salary / CTC Calculator', category: 'Salary', description: 'Estimate monthly take-home salary and total deductions.', icon: 'briefcase', route: '/calculators/salary', active: true },
          { id: 'gst', name: 'GST Calculator', category: 'Shopping', description: 'Compute CGST, SGST and total price for GST rates.', icon: 'receipt', route: '/calculators/gst', active: true },
          { id: 'percentage', name: 'Percentage Calculator', category: 'Lifestyle', description: 'Easily calculate percentage of value, increases and differences.', icon: 'percent', route: '/calculators/percentage', active: true },
          { id: 'discount', name: 'Discount Calculator', category: 'Shopping', description: 'Find out final price after discount and total savings.', icon: 'tag', route: '/calculators/discount', active: true },
          { id: 'fuel', name: 'Fuel Cost Calculator', category: 'Lifestyle', description: 'Calculate trip fuel costs, required litres, and cost per km.', icon: 'fuel', route: '/calculators/fuel', active: true },
          { id: 'inflation', name: 'Inflation Calculator', category: 'Finance', description: 'Understand future cost of living and purchasing power impact.', icon: 'arrow-up-right', route: '/calculators/inflation', active: true },
          { id: 'rent-affordability', name: 'Rent Affordability', category: 'Loans', description: 'Evaluate rent budget against income and existing EMIs.', icon: 'home', route: '/calculators/rent-affordability', active: true }
        ]);
      }
    });
  }
}

