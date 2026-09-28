import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'BharatDecision | AI-Powered India Decision Platform'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'All Calculators | BharatDecision Platform'
  },
  {
    path: 'calculators/emi',
    loadComponent: () => import('./features/calculators/emi/emi-calculator.component').then(m => m.EmiCalculatorComponent),
    title: 'EMI Calculator | Calculate Monthly Loan EMI & Interest'
  },
  {
    path: 'calculators/sip',
    loadComponent: () => import('./features/calculators/sip/sip-calculator.component').then(m => m.SipCalculatorComponent),
    title: 'SIP Calculator | Wealth & Mutual Fund Future Value'
  },
  {
    path: 'calculators/fd',
    loadComponent: () => import('./features/calculators/fd/fd-calculator.component').then(m => m.FdCalculatorComponent),
    title: 'Fixed Deposit (FD) Calculator | Interest & Maturity Amount'
  },
  {
    path: 'calculators/salary',
    loadComponent: () => import('./features/calculators/salary/salary-calculator.component').then(m => m.SalaryCalculatorComponent),
    title: 'Salary & CTC Calculator | In-Hand Take-Home Breakdown'
  },
  {
    path: 'calculators/gst',
    loadComponent: () => import('./features/calculators/gst/gst-calculator.component').then(m => m.GstCalculatorComponent),
    title: 'GST Calculator | CGST, SGST & Tax Amount'
  },
  {
    path: 'calculators/percentage',
    loadComponent: () => import('./features/calculators/percentage/percentage-calculator.component').then(m => m.PercentageCalculatorComponent),
    title: 'Percentage Calculator | Increase, Decrease & Difference'
  },
  {
    path: 'calculators/discount',
    loadComponent: () => import('./features/calculators/discount/discount-calculator.component').then(m => m.DiscountCalculatorComponent),
    title: 'Discount Calculator | Final Price & Shopping Savings'
  },
  {
    path: 'calculators/fuel',
    loadComponent: () => import('./features/calculators/fuel/fuel-calculator.component').then(m => m.FuelCalculatorComponent),
    title: 'Fuel Cost Calculator | Trip Expense & Cost Per Km'
  },
  {
    path: 'calculators/inflation',
    loadComponent: () => import('./features/calculators/inflation/inflation-calculator.component').then(m => m.InflationCalculatorComponent),
    title: 'Inflation Calculator | Cost of Living & Purchasing Power'
  },
  {
    path: 'calculators/rent-affordability',
    loadComponent: () => import('./features/calculators/rent-affordability/rent-affordability-calculator.component').then(m => m.RentAffordabilityCalculatorComponent),
    title: 'Rent Affordability Calculator | Housing Budget Evaluation'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
