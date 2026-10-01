package com.indiadecision.platform.controller;

import com.indiadecision.platform.dto.*;
import com.indiadecision.platform.service.ai.AiOrchestratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiOrchestratorController {

    private final AiOrchestratorService aiOrchestratorService;

    public AiOrchestratorController(AiOrchestratorService aiOrchestratorService) {
        this.aiOrchestratorService = aiOrchestratorService;
    }

    @PostMapping("/orchestrate")
    public ResponseEntity<ApiResponse<AiOrchestrationResponseDto>> orchestrate(@RequestBody AiOrchestrationRequestDto request) {
        AiOrchestrationResponseDto response = aiOrchestratorService.orchestrate(request);
        return ResponseEntity.ok(ApiResponse.success(response, "AI decision orchestration complete"));
    }

    @PostMapping("/insight")
    public ResponseEntity<ApiResponse<AiInsightResponseDto>> generateInsight(@RequestBody AiInsightRequestDto request) {
        AiInsightResponseDto insight = aiOrchestratorService.generateInsight(request);
        return ResponseEntity.ok(ApiResponse.success(insight, "AI insight takeaway generated"));
    }

    @GetMapping("/journey/car-affordability")
    public ResponseEntity<ApiResponse<CarAffordabilityJourneyResponseDto>> evaluateCarAffordability(
            @RequestParam(defaultValue = "120000") double monthlyIncome,
            @RequestParam(defaultValue = "2500000") double carPrice,
            @RequestParam(defaultValue = "500000") double downPayment,
            @RequestParam(defaultValue = "5") int tenureYears,
            @RequestParam(defaultValue = "8.5") double interestRate) {
        
        CarAffordabilityJourneyResponseDto result = aiOrchestratorService.evaluateCarAffordabilityJourney(
                monthlyIncome, carPrice, downPayment, tenureYears, interestRate);
        return ResponseEntity.ok(ApiResponse.success(result, "Car affordability decision journey evaluated"));
    }
}
