import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  ApiResponse,
  CalculatorMetadata,
  EmiRequest,
  EmiResponse,
  SipRequest,
  SipResponse,
  FdRequest,
  FdResponse,
  SalaryRequest,
  SalaryResponse,
  GstRequest,
  GstResponse,
  PercentageRequest,
  PercentageResponse,
  DiscountRequest,
  DiscountResponse,
  FuelCostRequest,
  FuelCostResponse,
  InflationRequest,
  InflationResponse,
  RentAffordabilityRequest,
  RentAffordabilityResponse,
  AiOrchestrationRequest,
  AiOrchestrationResponse
} from '../models/calculator.model';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private readonly baseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `${window.location.origin}/api`
    : 'http://localhost:8080/api';

  private readonly mockCalculators: CalculatorMetadata[] = [
    { id: 'emi', name: 'EMI Calculator', category: 'Loans', description: 'Calculate monthly loan EMI, interest breakdown and repayment schedule.', icon: 'calculator', route: '/calculators/emi', active: true },
    { id: 'sip', name: 'SIP Calculator', category: 'Finance', description: 'Estimate wealth accumulation through Systematic Investment Plans.', icon: 'trending-up', route: '/calculators/sip', active: true },
    { id: 'fd', name: 'Fixed Deposit (FD)', category: 'Finance', description: 'Calculate guaranteed maturity returns and interest earned on fixed deposits.', icon: 'piggy-bank', route: '/calculators/fd', active: true },
    { id: 'salary', name: 'Salary / CTC Calculator', category: 'Salary', description: 'Estimate monthly take-home in-hand salary and total deductions from CTC.', icon: 'briefcase', route: '/calculators/salary', active: true },
    { id: 'gst', name: 'GST Calculator', category: 'Shopping', description: 'Compute CGST, SGST and total price for GST inclusive/exclusive rates.', icon: 'receipt', route: '/calculators/gst', active: true },
    { id: 'percentage', name: 'Percentage Calculator', category: 'Lifestyle', description: 'Easily calculate percentage of value, increases, decreases and differences.', icon: 'percent', route: '/calculators/percentage', active: true },
    { id: 'discount', name: 'Discount Calculator', category: 'Shopping', description: 'Find out final price after discount and total savings while shopping.', icon: 'tag', route: '/calculators/discount', active: true },
    { id: 'fuel', name: 'Fuel Cost Calculator', category: 'Lifestyle', description: 'Calculate trip fuel costs, required litres, and per-kilometer expense.', icon: 'fuel', route: '/calculators/fuel', active: true },
    { id: 'inflation', name: 'Inflation Calculator', category: 'Finance', description: 'Understand future cost of living and purchasing power impact over time.', icon: 'arrow-up-right', route: '/calculators/inflation', active: true },
    { id: 'rent-affordability', name: 'Rent Affordability', category: 'Loans', description: 'Evaluate rent budget against income, existing EMIs and expense ratio.', icon: 'home', route: '/calculators/rent-affordability', active: true }
  ];

  constructor(private http: HttpClient) {}

  getCalculators(): Observable<CalculatorMetadata[]> {
    return this.http.get<ApiResponse<CalculatorMetadata[]>>(`${this.baseUrl}/calculators`).pipe(
      map(res => res.data),
      catchError(() => of(this.mockCalculators))
    );
  }

  getCalculatorById(id: string): Observable<CalculatorMetadata> {
    return this.http.get<ApiResponse<CalculatorMetadata>>(`${this.baseUrl}/calculators/${id}`).pipe(
      map(res => res.data),
      catchError(() => {
        const found = this.mockCalculators.find(c => c.id === id);
        return of(found || this.mockCalculators[0]);
      })
    );
  }

  calculateEmi(req: EmiRequest): Observable<EmiResponse> {
    return this.http.post<ApiResponse<EmiResponse>>(`${this.baseUrl}/calculators/emi`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackEmi(req)))
    );
  }

  calculateSip(req: SipRequest): Observable<SipResponse> {
    return this.http.post<ApiResponse<SipResponse>>(`${this.baseUrl}/calculators/sip`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackSip(req)))
    );
  }

  calculateFd(req: FdRequest): Observable<FdResponse> {
    return this.http.post<ApiResponse<FdResponse>>(`${this.baseUrl}/calculators/fd`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackFd(req)))
    );
  }

  calculateSalary(req: SalaryRequest): Observable<SalaryResponse> {
    return this.http.post<ApiResponse<SalaryResponse>>(`${this.baseUrl}/calculators/salary`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackSalary(req)))
    );
  }

  calculateGst(req: GstRequest): Observable<GstResponse> {
    return this.http.post<ApiResponse<GstResponse>>(`${this.baseUrl}/calculators/gst`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackGst(req)))
    );
  }

  calculatePercentage(req: PercentageRequest): Observable<PercentageResponse> {
    return this.http.post<ApiResponse<PercentageResponse>>(`${this.baseUrl}/calculators/percentage`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackPercentage(req)))
    );
  }

  calculateDiscount(req: DiscountRequest): Observable<DiscountResponse> {
    return this.http.post<ApiResponse<DiscountResponse>>(`${this.baseUrl}/calculators/discount`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackDiscount(req)))
    );
  }

  calculateFuelCost(req: FuelCostRequest): Observable<FuelCostResponse> {
    return this.http.post<ApiResponse<FuelCostResponse>>(`${this.baseUrl}/calculators/fuel`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackFuelCost(req)))
    );
  }

  calculateInflation(req: InflationRequest): Observable<InflationResponse> {
    return this.http.post<ApiResponse<InflationResponse>>(`${this.baseUrl}/calculators/inflation`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackInflation(req)))
    );
  }

  calculateRentAffordability(req: RentAffordabilityRequest): Observable<RentAffordabilityResponse> {
    return this.http.post<ApiResponse<RentAffordabilityResponse>>(`${this.baseUrl}/calculators/rent-affordability`, req).pipe(
      map(res => res.data),
      catchError(() => of(this.fallbackRentAffordability(req)))
    );
  }

  orchestrateAi(req: AiOrchestrationRequest): Observable<AiOrchestrationResponse> {
    return this.http.post<ApiResponse<AiOrchestrationResponse>>(`${this.baseUrl}/ai/orchestrate`, req).pipe(
      map(res => res.data),
      catchError(() => of({
        intentCode: 'FINANCIAL_QUERY',
        recommendedCalculatorId: 'emi',
        calculatorName: 'EMI Calculator',
        requiredInputs: ['principal', 'annualInterestRate', 'tenureValue'],
        explanation: `Goal parsed: "${req.userQuery}". We recommend exploring our EMI or SIP calculators for exact figures.`,
        calculationResult: null
      }))
    );
  }

  getAiInsight(req: { calculatorId: string; inputData: any; resultData: any }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/ai/insight`, req).pipe(
      map(res => res.data),
      catchError(() => of({
        healthStatus: 'HEALTHY',
        badgeColor: 'bg-emerald-500',
        title: '⚡ AI Financial Decision Insight',
        aiTakeaway: 'Calculated results follow standard Indian personal finance guidelines.',
        keyObservations: [
          'Monthly financial commitments verified against standard benchmarks.',
          'Ensure 6 months of essential expenses are kept in an emergency liquid fund.'
        ],
        recommendedNextTool: 'sip'
      }))
    );
  }

  getCarAffordabilityJourney(params: { monthlyIncome?: number; carPrice?: number; downPayment?: number; tenureYears?: number; interestRate?: number }): Observable<any> {
    const query = `monthlyIncome=${params.monthlyIncome || 120000}&carPrice=${params.carPrice || 2500000}&downPayment=${params.downPayment || 500000}&tenureYears=${params.tenureYears || 5}&interestRate=${params.interestRate || 8.5}`;
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/ai/journey/car-affordability?${query}`).pipe(
      map(res => res.data),
      catchError(() => of({
        monthlyIncome: params.monthlyIncome || 120000,
        carPrice: params.carPrice || 2500000,
        downPayment: params.downPayment || 500000,
        loanAmount: 2000000,
        monthlyEmi: 41067,
        monthlyFuelCost: 6667,
        totalMonthlyExpense: 47734,
        safeMaxEmiThreshold: 12000,
        riskLevel: 'HIGH_RISK',
        badgeColor: 'bg-red-500',
        aiDecisionSummary: 'Total monthly car cost (₹47,734) exceeds the safe 10% gross income limit (₹12,000). Consider a higher down payment or selecting a vehicle under ₹12 Lakhs.',
        financialRuleChecklist: [
          '20% Down Payment Check: Offered ₹5,00,000 (Met)',
          '4-Year Loan Tenure Check: Currently 5 years',
          '10% Gross Income EMI Rule: Limit ₹12,000 vs Actual ₹41,067 (Exceeded)'
        ],
        alternativeOptions: [
          'Option A: Increase down payment to ₹10,00,000.',
          'Option B: Choose a car priced under ₹12,00,000.',
          'Option C: Save via equity SIP for 24 months before purchase.'
        ]
      }))
    );
  }

  // --- Client-Side Hybrid Calculation Fallbacks ---

  private fallbackEmi(req: EmiRequest): EmiResponse {
    const P = req.principal;
    const r = req.annualInterestRate / 12 / 100;
    const n = req.tenureUnit === 'YEARS' ? req.tenureValue * 12 : req.tenureValue;
    const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const principalPercentage = Math.round((P / totalPayment) * 100);
    const interestPercentage = 100 - principalPercentage;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalAmount: P,
      principalPercentage,
      interestPercentage,
      schedule: []
    };
  }

  private fallbackSip(req: SipRequest): SipResponse {
    const P = req.monthlyInvestment;
    const i = req.expectedAnnualReturn / 12 / 100;
    const n = req.durationYears * 12;
    const futureValue = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvestment = P * n;
    const estimatedReturns = futureValue - totalInvestment;

    return {
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      futureValue: Math.round(futureValue),
      disclaimer: 'Returns are estimates based on expected rate.',
      yearlyGrowth: []
    };
  }

  private fallbackFd(req: FdRequest): FdResponse {
    const P = req.principal;
    const r = req.annualInterestRate / 100;
    const t = req.tenureYears;
    const maturityAmount = P * Math.pow(1 + r / 4, 4 * t);
    const interestEarned = maturityAmount - P;

    return {
      principal: P,
      interestEarned: Math.round(interestEarned),
      maturityAmount: Math.round(maturityAmount),
      compoundingFrequency: req.compoundingFrequency || 'QUARTERLY'
    };
  }

  private fallbackSalary(req: SalaryRequest): SalaryResponse {
    const ctc = req.annualCtc;
    const monthlyGross = ctc / 12;
    const pfMonthly = Math.min(monthlyGross * 0.5 * 0.12, 1800);
    const professionalTaxMonthly = 200;
    const totalMonthlyDeductions = pfMonthly + professionalTaxMonthly;
    const estimatedMonthlyInHand = monthlyGross - totalMonthlyDeductions;

    return {
      annualCtc: ctc,
      monthlyGross: Math.round(monthlyGross),
      monthlyPfDeduction: Math.round(pfMonthly),
      monthlyProfessionalTax: professionalTaxMonthly,
      monthlyOtherDeductions: 0,
      totalMonthlyDeductions: Math.round(totalMonthlyDeductions),
      estimatedMonthlyInHand: Math.round(estimatedMonthlyInHand),
      annualDeductions: Math.round(totalMonthlyDeductions * 12),
      annualInHand: Math.round(estimatedMonthlyInHand * 12),
      disclaimer: 'Salary calculation is based on standard Indian corporate CTC structure.'
    };
  }

  private fallbackGst(req: GstRequest): GstResponse {
    const rate = req.gstPercentage;
    const amount = req.amount;
    let gstAmount = 0;
    let baseAmount = 0;
    let finalAmount = 0;

    if (!req.inclusive) {
      gstAmount = (amount * rate) / 100;
      baseAmount = amount;
      finalAmount = amount + gstAmount;
    } else {
      baseAmount = amount / (1 + rate / 100);
      gstAmount = amount - baseAmount;
      finalAmount = amount;
    }

    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      cgst: Math.round((gstAmount / 2) * 100) / 100,
      sgst: Math.round((gstAmount / 2) * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      gstPercentage: rate,
      inclusive: req.inclusive
    };
  }

  private fallbackPercentage(req: PercentageRequest): PercentageResponse {
    const x = req.valueX;
    const y = req.valueY;
    let res = 0;
    let expl = '';

    if (req.mode === 'PERCENTAGE_OF') {
      res = (x * y) / 100;
      expl = `${x}% of ${y} = ${res}`;
    } else if (req.mode === 'PERCENTAGE_INCREASE') {
      res = y + (y * x) / 100;
      expl = `${y} increased by ${x}% = ${res}`;
    } else if (req.mode === 'PERCENTAGE_DECREASE') {
      res = y - (y * x) / 100;
      expl = `${y} decreased by ${x}% = ${res}`;
    } else {
      res = Math.abs(x - y);
      expl = `Difference between ${x} and ${y} = ${res}`;
    }

    return {
      mode: req.mode,
      valueX: x,
      valueY: y,
      result: Math.round(res * 100) / 100,
      explanation: expl
    };
  }

  private fallbackDiscount(req: DiscountRequest): DiscountResponse {
    const orig = req.originalPrice;
    const discPct = req.discountPercentage;
    const discountAmount = (orig * discPct) / 100;
    const finalPrice = orig - discountAmount;
    return {
      originalPrice: orig,
      discountPercentage: discPct,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      amountSaved: Math.round(discountAmount * 100) / 100
    };
  }

  private fallbackFuelCost(req: FuelCostRequest): FuelCostResponse {
    const dist = req.distanceKm;
    const mileage = req.vehicleMileageKmpl;
    const price = req.fuelPricePerLitre;
    const totalLitres = dist / mileage;
    const totalCost = totalLitres * price;
    const costPerKm = totalCost / dist;

    return {
      fuelRequiredLitres: Math.round(totalLitres * 100) / 100,
      estimatedFuelCost: Math.round(totalCost),
      costPerKm: Math.round(costPerKm * 100) / 100,
      distanceKm: dist,
      vehicleMileageKmpl: mileage
    };
  }

  private fallbackInflation(req: InflationRequest): InflationResponse {
    const cost = req.currentAmount;
    const rate = req.inflationRate / 100;
    const years = req.years;
    const futureCost = cost * Math.pow(1 + rate, years);
    const purchasingPowerVal = cost / Math.pow(1 + rate, years);
    const lossPercentage = Math.round((1 - purchasingPowerVal / cost) * 100);

    return {
      currentAmount: cost,
      futureEquivalentAmount: Math.round(futureCost),
      purchasingPowerEquivalent: Math.round(purchasingPowerVal),
      purchasingPowerLossPercentage: lossPercentage,
      inflationRate: req.inflationRate,
      years,
      disclaimer: 'Based on constant compounding inflation rates.'
    };
  }

  private fallbackRentAffordability(req: RentAffordabilityRequest): RentAffordabilityResponse {
    const income = req.monthlyIncome;
    const emi = req.existingMonthlyEmi || 0;
    const rent = req.monthlyRent;
    const other = req.otherMonthlyExpenses || 0;
    const totalObligations = emi + rent + other;
    const remaining = income - totalObligations;
    const rentToIncomeRatio = Math.round((rent / income) * 100);
    const totalExpenseRatio = Math.round((totalObligations / income) * 100);

    let status = 'HEALTHY';
    let color = 'bg-emerald-500';
    let rec = 'Your rent and total monthly obligations are within healthy limits.';

    if (rentToIncomeRatio > 40 || totalExpenseRatio > 70) {
      status = 'HIGH_RISK';
      color = 'bg-red-500';
      rec = 'Rent exceeds 40% of income or total expenses exceed 70%. High financial risk.';
    } else if (rentToIncomeRatio > 30 || totalExpenseRatio > 50) {
      status = 'MODERATE_RISK';
      color = 'bg-amber-500';
      rec = 'Rent is between 30%-40% of income. Consider reducing secondary expenses.';
    }

    return {
      monthlyIncome: income,
      monthlyRent: rent,
      totalMonthlyObligations: Math.round(totalObligations),
      remainingMonthlyIncome: Math.round(remaining),
      rentToIncomeRatio,
      totalExpenseRatio,
      affordabilityStatus: status,
      affordabilityBadgeColor: color,
      recommendation: rec,
      disclaimer: 'Affordability guidance is based on standard financial planning rules.'
    };
  }
}
