package com.indiadecision.platform.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiOrchestrationResponseDto {
    private String intentCode;
    private String recommendedCalculatorId;
    private String calculatorName;
    private List<String> requiredInputs;
    private String explanation;
    private List<String> retrievedContext = new ArrayList<>();
    private Object calculationResult;
    private Map<String, Object> extractedParameters = new HashMap<>();
    private String decisionVerdict = "HEALTHY";
    private String badgeColor = "bg-emerald-500";
    private List<String> followUpQuestions = new ArrayList<>();
    private Map<String, String> keyMetrics = new HashMap<>();

    public AiOrchestrationResponseDto() {}

    public AiOrchestrationResponseDto(String intentCode, String recommendedCalculatorId, String calculatorName, List<String> requiredInputs, String explanation, List<String> retrievedContext, Object calculationResult) {
        this.intentCode = intentCode;
        this.recommendedCalculatorId = recommendedCalculatorId;
        this.calculatorName = calculatorName;
        this.requiredInputs = requiredInputs;
        this.explanation = explanation;
        this.retrievedContext = retrievedContext != null ? retrievedContext : new ArrayList<>();
        this.calculationResult = calculationResult;
    }

    public AiOrchestrationResponseDto(String intentCode, String recommendedCalculatorId, String calculatorName, List<String> requiredInputs, String explanation, List<String> retrievedContext, Object calculationResult, Map<String, Object> extractedParameters) {
        this.intentCode = intentCode;
        this.recommendedCalculatorId = recommendedCalculatorId;
        this.calculatorName = calculatorName;
        this.requiredInputs = requiredInputs;
        this.explanation = explanation;
        this.retrievedContext = retrievedContext != null ? retrievedContext : new ArrayList<>();
        this.calculationResult = calculationResult;
        this.extractedParameters = extractedParameters != null ? extractedParameters : new HashMap<>();
    }

    public String getIntentCode() { return intentCode; }
    public void setIntentCode(String intentCode) { this.intentCode = intentCode; }

    public String getRecommendedCalculatorId() { return recommendedCalculatorId; }
    public void setRecommendedCalculatorId(String recommendedCalculatorId) { this.recommendedCalculatorId = recommendedCalculatorId; }

    public String getCalculatorName() { return calculatorName; }
    public void setCalculatorName(String calculatorName) { this.calculatorName = calculatorName; }

    public List<String> getRequiredInputs() { return requiredInputs; }
    public void setRequiredInputs(List<String> requiredInputs) { this.requiredInputs = requiredInputs; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getRetrievedContext() { return retrievedContext; }
    public void setRetrievedContext(List<String> retrievedContext) { this.retrievedContext = retrievedContext; }

    public Object getCalculationResult() { return calculationResult; }
    public void setCalculationResult(Object calculationResult) { this.calculationResult = calculationResult; }

    public Map<String, Object> getExtractedParameters() { return extractedParameters; }
    public void setExtractedParameters(Map<String, Object> extractedParameters) { this.extractedParameters = extractedParameters; }

    public String getDecisionVerdict() { return decisionVerdict; }
    public void setDecisionVerdict(String decisionVerdict) { this.decisionVerdict = decisionVerdict; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public List<String> getFollowUpQuestions() { return followUpQuestions; }
    public void setFollowUpQuestions(List<String> followUpQuestions) { this.followUpQuestions = followUpQuestions; }

    public Map<String, String> getKeyMetrics() { return keyMetrics; }
    public void setKeyMetrics(Map<String, String> keyMetrics) { this.keyMetrics = keyMetrics; }
}
