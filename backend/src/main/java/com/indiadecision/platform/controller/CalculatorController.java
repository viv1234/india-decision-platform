package com.indiadecision.platform.controller;

import com.indiadecision.platform.dto.*;
import com.indiadecision.platform.entity.CalculatorEntity;
import com.indiadecision.platform.entity.CalculatorUsageEntity;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.repository.CalculatorRepository;
import com.indiadecision.platform.repository.CalculatorUsageRepository;
import com.indiadecision.platform.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculators")
public class CalculatorController {

    private final CalculatorRepository calculatorRepository;
    private final CalculatorUsageRepository usageRepository;
    private final EmiCalculatorService emiCalculatorService;
    private final SipCalculatorService sipCalculatorService;
    private final FdCalculatorService fdCalculatorService;
    private final SalaryCalculatorService salaryCalculatorService;
    private final GstCalculatorService gstCalculatorService;
    private final PercentageCalculatorService percentageCalculatorService;
    private final DiscountCalculatorService discountCalculatorService;
    private final FuelCostCalculatorService fuelCostCalculatorService;
    private final InflationCalculatorService inflationCalculatorService;
    private final RentAffordabilityService rentAffordabilityService;

    public CalculatorController(
            CalculatorRepository calculatorRepository,
            CalculatorUsageRepository usageRepository,
            EmiCalculatorService emiCalculatorService,
            SipCalculatorService sipCalculatorService,
            FdCalculatorService fdCalculatorService,
            SalaryCalculatorService salaryCalculatorService,
            GstCalculatorService gstCalculatorService,
            PercentageCalculatorService percentageCalculatorService,
            DiscountCalculatorService discountCalculatorService,
            FuelCostCalculatorService fuelCostCalculatorService,
            InflationCalculatorService inflationCalculatorService,
            RentAffordabilityService rentAffordabilityService) {
        this.calculatorRepository = calculatorRepository;
        this.usageRepository = usageRepository;
        this.emiCalculatorService = emiCalculatorService;
        this.sipCalculatorService = sipCalculatorService;
        this.fdCalculatorService = fdCalculatorService;
        this.salaryCalculatorService = salaryCalculatorService;
        this.gstCalculatorService = gstCalculatorService;
        this.percentageCalculatorService = percentageCalculatorService;
        this.discountCalculatorService = discountCalculatorService;
        this.fuelCostCalculatorService = fuelCostCalculatorService;
        this.inflationCalculatorService = inflationCalculatorService;
        this.rentAffordabilityService = rentAffordabilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CalculatorMetadataDto>>> getAllCalculators() {
        List<CalculatorEntity> entities = calculatorRepository.findByActiveTrueOrderByDisplayOrderAsc();
        List<CalculatorMetadataDto> dtoList = entities.stream()
                .map(e -> new CalculatorMetadataDto(e.getId(), e.getName(), e.getCategory(), e.getDescription(), e.getIcon(), e.getRoute(), e.isActive()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(dtoList, "Calculators fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CalculatorMetadataDto>> getCalculatorById(@PathVariable String id) {
        CalculatorEntity entity = calculatorRepository.findById(id)
                .orElseThrow(() -> new InvalidInputException("Calculator not found with id: " + id, "NOT_FOUND"));
        CalculatorMetadataDto dto = new CalculatorMetadataDto(entity.getId(), entity.getName(), entity.getCategory(), entity.getDescription(), entity.getIcon(), entity.getRoute(), entity.isActive());
        return ResponseEntity.ok(ApiResponse.success(dto, "Calculator found"));
    }

    @PostMapping("/emi")
    public ResponseEntity<ApiResponse<EmiResponseDto>> calculateEmi(@Valid @RequestBody EmiRequestDto request) {
        long start = System.currentTimeMillis();
        EmiResponseDto response = emiCalculatorService.calculateEmi(request);
        logUsage("emi", start);
        return ResponseEntity.ok(ApiResponse.success(response, "EMI calculated successfully"));
    }

    @PostMapping("/sip")
    public ResponseEntity<ApiResponse<SipResponseDto>> calculateSip(@Valid @RequestBody SipRequestDto request) {
        long start = System.currentTimeMillis();
        SipResponseDto response = sipCalculatorService.calculateSip(request);
        logUsage("sip", start);
        return ResponseEntity.ok(ApiResponse.success(response, "SIP calculated successfully"));
    }

    @PostMapping("/fd")
    public ResponseEntity<ApiResponse<FdResponseDto>> calculateFd(@Valid @RequestBody FdRequestDto request) {
        long start = System.currentTimeMillis();
        FdResponseDto response = fdCalculatorService.calculateFd(request);
        logUsage("fd", start);
        return ResponseEntity.ok(ApiResponse.success(response, "FD maturity calculated successfully"));
    }

    @PostMapping("/salary")
    public ResponseEntity<ApiResponse<SalaryResponseDto>> calculateSalary(@Valid @RequestBody SalaryRequestDto request) {
        long start = System.currentTimeMillis();
        SalaryResponseDto response = salaryCalculatorService.calculateSalary(request);
        logUsage("salary", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Salary breakdown calculated successfully"));
    }

    @PostMapping("/gst")
    public ResponseEntity<ApiResponse<GstResponseDto>> calculateGst(@Valid @RequestBody GstRequestDto request) {
        long start = System.currentTimeMillis();
        GstResponseDto response = gstCalculatorService.calculateGst(request);
        logUsage("gst", start);
        return ResponseEntity.ok(ApiResponse.success(response, "GST calculated successfully"));
    }

    @PostMapping("/percentage")
    public ResponseEntity<ApiResponse<PercentageResponseDto>> calculatePercentage(@Valid @RequestBody PercentageRequestDto request) {
        long start = System.currentTimeMillis();
        PercentageResponseDto response = percentageCalculatorService.calculatePercentage(request);
        logUsage("percentage", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Percentage calculated successfully"));
    }

    @PostMapping("/discount")
    public ResponseEntity<ApiResponse<DiscountResponseDto>> calculateDiscount(@Valid @RequestBody DiscountRequestDto request) {
        long start = System.currentTimeMillis();
        DiscountResponseDto response = discountCalculatorService.calculateDiscount(request);
        logUsage("discount", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Discount calculated successfully"));
    }

    @PostMapping("/fuel")
    public ResponseEntity<ApiResponse<FuelCostResponseDto>> calculateFuelCost(@Valid @RequestBody FuelCostRequestDto request) {
        long start = System.currentTimeMillis();
        FuelCostResponseDto response = fuelCostCalculatorService.calculateFuelCost(request);
        logUsage("fuel", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Fuel cost calculated successfully"));
    }

    @PostMapping("/inflation")
    public ResponseEntity<ApiResponse<InflationResponseDto>> calculateInflation(@Valid @RequestBody InflationRequestDto request) {
        long start = System.currentTimeMillis();
        InflationResponseDto response = inflationCalculatorService.calculateInflation(request);
        logUsage("inflation", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Inflation impact calculated successfully"));
    }

    @PostMapping("/rent-affordability")
    public ResponseEntity<ApiResponse<RentAffordabilityResponseDto>> calculateRentAffordability(@Valid @RequestBody RentAffordabilityRequestDto request) {
        long start = System.currentTimeMillis();
        RentAffordabilityResponseDto response = rentAffordabilityService.calculateRentAffordability(request);
        logUsage("rent-affordability", start);
        return ResponseEntity.ok(ApiResponse.success(response, "Rent affordability evaluated successfully"));
    }

    private void logUsage(String calculatorCode, long startMs) {
        try {
            long executionTime = System.currentTimeMillis() - startMs;
            usageRepository.save(new CalculatorUsageEntity(calculatorCode, "anon-session", "{}", "{}", executionTime));
        } catch (Exception ignored) {
            // Safe logging fallback
        }
    }
}
