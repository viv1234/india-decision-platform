export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
  timestamp: string;
}

export interface CalculatorMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  route: string;
  active: boolean;
}

// EMI
export interface EmiRequest {
  principal: number;
  annualInterestRate: number;
  tenureValue: number;
  tenureUnit: 'YEARS' | 'MONTHS';
}

export interface AmortizationItem {
  month: number;
  principalPaid: number;
  interestPaid: number;
  balanceRemaining: number;
}

export interface EmiResponse {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalAmount: number;
  principalPercentage: number;
  interestPercentage: number;
  schedule: AmortizationItem[];
}

// SIP
export interface SipRequest {
  monthlyInvestment: number;
  expectedAnnualReturn: number;
  durationYears: number;
}

export interface YearlyGrowthItem {
  year: number;
  investedAmount: number;
  estimatedValue: number;
}

export interface SipResponse {
  totalInvestment: number;
  estimatedReturns: number;
  futureValue: number;
  disclaimer: string;
  yearlyGrowth: YearlyGrowthItem[];
}

// FD
export interface FdRequest {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  compoundingFrequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
}

export interface FdResponse {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
  compoundingFrequency: string;
}

// Salary
export interface SalaryRequest {
  annualCtc: number;
  basicMonthly?: number;
  hraMonthly?: number;
  otherAllowancesMonthly?: number;
  employeePfMonthly?: number;
  professionalTaxMonthly?: number;
  otherDeductionsMonthly?: number;
}

export interface SalaryResponse {
  annualCtc: number;
  monthlyGross: number;
  monthlyPfDeduction: number;
  monthlyProfessionalTax: number;
  monthlyOtherDeductions: number;
  totalMonthlyDeductions: number;
  estimatedMonthlyInHand: number;
  annualDeductions: number;
  annualInHand: number;
  disclaimer: string;
}

// GST
export interface GstRequest {
  amount: number;
  gstPercentage: number;
  inclusive: boolean;
}

export interface GstResponse {
  baseAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  finalAmount: number;
  gstPercentage: number;
  inclusive: boolean;
}

// Percentage
export interface PercentageRequest {
  mode: 'PERCENTAGE_OF' | 'PERCENTAGE_INCREASE' | 'PERCENTAGE_DECREASE' | 'PERCENTAGE_DIFFERENCE';
  valueX: number;
  valueY: number;
}

export interface PercentageResponse {
  mode: string;
  valueX: number;
  valueY: number;
  result: number;
  explanation: string;
}

// Discount
export interface DiscountRequest {
  originalPrice: number;
  discountPercentage: number;
}

export interface DiscountResponse {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  amountSaved: number;
}

// Fuel
export interface FuelCostRequest {
  distanceKm: number;
  vehicleMileageKmpl: number;
  fuelPricePerLitre: number;
}

export interface FuelCostResponse {
  fuelRequiredLitres: number;
  estimatedFuelCost: number;
  costPerKm: number;
  distanceKm: number;
  vehicleMileageKmpl: number;
}

// Inflation
export interface InflationRequest {
  currentAmount: number;
  inflationRate: number;
  years: number;
}

export interface InflationResponse {
  currentAmount: number;
  futureEquivalentAmount: number;
  purchasingPowerEquivalent: number;
  purchasingPowerLossPercentage: number;
  inflationRate: number;
  years: number;
  disclaimer: string;
}

// Rent Affordability
export interface RentAffordabilityRequest {
  monthlyIncome: number;
  existingMonthlyEmi?: number;
  monthlyRent: number;
  otherMonthlyExpenses?: number;
}

export interface RentAffordabilityResponse {
  monthlyIncome: number;
  monthlyRent: number;
  totalMonthlyObligations: number;
  remainingMonthlyIncome: number;
  rentToIncomeRatio: number;
  totalExpenseRatio: number;
  affordabilityStatus: string;
  affordabilityBadgeColor: string;
  recommendation: string;
  disclaimer: string;
}

// AI Orchestration
export interface AiOrchestrationRequest {
  userQuery: string;
}

export interface AiOrchestrationResponse {
  intentCode: string;
  recommendedCalculatorId: string;
  calculatorName: string;
  requiredInputs: string[];
  explanation: string;
  retrievedContext?: string[];
  calculationResult: any;
}
