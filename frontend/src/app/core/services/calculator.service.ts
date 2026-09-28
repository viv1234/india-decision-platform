import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCalculators(): Observable<CalculatorMetadata[]> {
    return this.http.get<ApiResponse<CalculatorMetadata[]>>(`${this.baseUrl}/calculators`)
      .pipe(map(res => res.data));
  }

  getCalculatorById(id: string): Observable<CalculatorMetadata> {
    return this.http.get<ApiResponse<CalculatorMetadata>>(`${this.baseUrl}/calculators/${id}`)
      .pipe(map(res => res.data));
  }

  calculateEmi(req: EmiRequest): Observable<EmiResponse> {
    return this.http.post<ApiResponse<EmiResponse>>(`${this.baseUrl}/calculators/emi`, req)
      .pipe(map(res => res.data));
  }

  calculateSip(req: SipRequest): Observable<SipResponse> {
    return this.http.post<ApiResponse<SipResponse>>(`${this.baseUrl}/calculators/sip`, req)
      .pipe(map(res => res.data));
  }

  calculateFd(req: FdRequest): Observable<FdResponse> {
    return this.http.post<ApiResponse<FdResponse>>(`${this.baseUrl}/calculators/fd`, req)
      .pipe(map(res => res.data));
  }

  calculateSalary(req: SalaryRequest): Observable<SalaryResponse> {
    return this.http.post<ApiResponse<SalaryResponse>>(`${this.baseUrl}/calculators/salary`, req)
      .pipe(map(res => res.data));
  }

  calculateGst(req: GstRequest): Observable<GstResponse> {
    return this.http.post<ApiResponse<GstResponse>>(`${this.baseUrl}/calculators/gst`, req)
      .pipe(map(res => res.data));
  }

  calculatePercentage(req: PercentageRequest): Observable<PercentageResponse> {
    return this.http.post<ApiResponse<PercentageResponse>>(`${this.baseUrl}/calculators/percentage`, req)
      .pipe(map(res => res.data));
  }

  calculateDiscount(req: DiscountRequest): Observable<DiscountResponse> {
    return this.http.post<ApiResponse<DiscountResponse>>(`${this.baseUrl}/calculators/discount`, req)
      .pipe(map(res => res.data));
  }

  calculateFuelCost(req: FuelCostRequest): Observable<FuelCostResponse> {
    return this.http.post<ApiResponse<FuelCostResponse>>(`${this.baseUrl}/calculators/fuel`, req)
      .pipe(map(res => res.data));
  }

  calculateInflation(req: InflationRequest): Observable<InflationResponse> {
    return this.http.post<ApiResponse<InflationResponse>>(`${this.baseUrl}/calculators/inflation`, req)
      .pipe(map(res => res.data));
  }

  calculateRentAffordability(req: RentAffordabilityRequest): Observable<RentAffordabilityResponse> {
    return this.http.post<ApiResponse<RentAffordabilityResponse>>(`${this.baseUrl}/calculators/rent-affordability`, req)
      .pipe(map(res => res.data));
  }

  orchestrateAi(req: AiOrchestrationRequest): Observable<AiOrchestrationResponse> {
    return this.http.post<ApiResponse<AiOrchestrationResponse>>(`${this.baseUrl}/ai/orchestrate`, req)
      .pipe(map(res => res.data));
  }
}
