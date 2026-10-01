package com.indiadecision.platform.service.ai;

import com.indiadecision.platform.dto.AiInsightRequestDto;
import com.indiadecision.platform.dto.AiInsightResponseDto;
import com.indiadecision.platform.dto.AiOrchestrationRequestDto;
import com.indiadecision.platform.dto.AiOrchestrationResponseDto;
import com.indiadecision.platform.dto.CarAffordabilityJourneyResponseDto;

public interface AiOrchestratorService {
    AiOrchestrationResponseDto orchestrate(AiOrchestrationRequestDto request);
    AiInsightResponseDto generateInsight(AiInsightRequestDto request);
    CarAffordabilityJourneyResponseDto evaluateCarAffordabilityJourney(double monthlyIncome, double carPrice, double downPayment, int tenureYears, double interestRate);
}
