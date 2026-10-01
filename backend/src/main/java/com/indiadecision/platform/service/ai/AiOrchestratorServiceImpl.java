package com.indiadecision.platform.service.ai;

import com.indiadecision.platform.dto.AiOrchestrationRequestDto;
import com.indiadecision.platform.dto.AiOrchestrationResponseDto;
import com.indiadecision.platform.dto.EmiRequestDto;
import com.indiadecision.platform.service.EmiCalculatorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiOrchestratorServiceImpl implements AiOrchestratorService {

    private final AiIntentDetector intentDetector;
    private final CalculatorToolRegistry toolRegistry;
    private final EmiCalculatorService emiCalculatorService;
    private final FinancialRagKnowledgeService ragKnowledgeService;
    private final AiApiClient aiApiClient;

    public AiOrchestratorServiceImpl(
            AiIntentDetector intentDetector,
            CalculatorToolRegistry toolRegistry,
            EmiCalculatorService emiCalculatorService,
            FinancialRagKnowledgeService ragKnowledgeService,
            AiApiClient aiApiClient) {
        this.intentDetector = intentDetector;
        this.toolRegistry = toolRegistry;
        this.emiCalculatorService = emiCalculatorService;
        this.ragKnowledgeService = ragKnowledgeService;
        this.aiApiClient = aiApiClient;
    }

    @Override
    public AiOrchestrationResponseDto orchestrate(AiOrchestrationRequestDto request) {
        String query = request.getUserQuery() != null ? request.getUserQuery() : "";
        
        // 1. Intent Detection
        AiIntentDetector.AiIntentResult intentResult = intentDetector.detectIntent(query);
        AiToolDescriptor descriptor = toolRegistry.getDescriptor(intentResult.recommendedCalculatorId());
        String toolName = descriptor != null ? descriptor.getToolName() : "Financial Calculator";

        // 2. RAG Knowledge Context Retrieval
        List<RagKnowledgeDocument> contextDocs = ragKnowledgeService.retrieveRelevantKnowledge(query, 3);
        List<String> contextSnippets = contextDocs.stream()
                .map(d -> String.format("[%s]: %s (Ref: %s)", d.getTitle(), d.getContent(), d.getSourceRule()))
                .collect(Collectors.toList());

        // 3. AI / RAG Generated Explanation
        String explanation = aiApiClient.generateRagResponse(query, contextDocs, toolName);

        // 4. Execution Result Calculation (if applicable)
        Object result = null;
        if (intentResult.intent() == AiIntent.CAR_AFFORDABILITY || intentResult.intent() == AiIntent.LOAN_AFFORDABILITY) {
            result = emiCalculatorService.calculateEmi(new EmiRequestDto(2500000.0, 8.5, 5, "YEARS"));
        }

        return new AiOrchestrationResponseDto(
                intentResult.intent().name(),
                intentResult.recommendedCalculatorId(),
                toolName,
                intentResult.requiredInputs(),
                explanation,
                contextSnippets,
                result
        );
    }
}
