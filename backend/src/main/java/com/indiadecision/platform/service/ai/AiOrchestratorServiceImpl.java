package com.indiadecision.platform.service.ai;

import com.indiadecision.platform.dto.AiOrchestrationRequestDto;
import com.indiadecision.platform.dto.AiOrchestrationResponseDto;
import com.indiadecision.platform.dto.EmiRequestDto;
import com.indiadecision.platform.service.EmiCalculatorService;
import org.springframework.stereotype.Service;

@Service
public class AiOrchestratorServiceImpl implements AiOrchestratorService {

    private final AiIntentDetector intentDetector;
    private final CalculatorToolRegistry toolRegistry;
    private final EmiCalculatorService emiCalculatorService;

    public AiOrchestratorServiceImpl(AiIntentDetector intentDetector, CalculatorToolRegistry toolRegistry, EmiCalculatorService emiCalculatorService) {
        this.intentDetector = intentDetector;
        this.toolRegistry = toolRegistry;
        this.emiCalculatorService = emiCalculatorService;
    }

    @Override
    public AiOrchestrationResponseDto orchestrate(AiOrchestrationRequestDto request) {
        String query = request.getUserQuery() != null ? request.getUserQuery() : "";
        AiIntentDetector.AiIntentResult intentResult = intentDetector.detectIntent(query);

        AiToolDescriptor descriptor = toolRegistry.getDescriptor(intentResult.recommendedCalculatorId());
        String toolName = descriptor != null ? descriptor.getToolName() : "Financial Calculator";

        // Demo sample calculation result for Phase 1 validation if query includes numbers
        Object result = null;
        if (intentResult.intent() == AiIntent.CAR_AFFORDABILITY || intentResult.intent() == AiIntent.LOAN_AFFORDABILITY) {
            result = emiCalculatorService.calculateEmi(new EmiRequestDto(2500000.0, 8.5, 5, "YEARS"));
        }

        String explanation = String.format(
                "Goal parsed: '%s'. Matched Intent: %s. We recommend using the %s. Required parameters: %s.",
                query,
                intentResult.intent().name(),
                toolName,
                String.join(", ", intentResult.requiredInputs())
        );

        return new AiOrchestrationResponseDto(
                intentResult.intent().name(),
                intentResult.recommendedCalculatorId(),
                toolName,
                intentResult.requiredInputs(),
                explanation,
                result
        );
    }
}
