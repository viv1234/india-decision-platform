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

    public AiOrchestrationResponseDto() {}

    public AiOrchestrationResponseDto(String intentCode, String recommendedCalculatorId, String calculatorName, List<String> requiredInputs, String explanation, List<String> retrievedContext, Object calculationResult) {
        this.intentCode = intentCode;
        this.recommendedCalculatorId = recommendedCalculatorId;
        this.calculatorName = calculatorName;
        this.requiredInputs = requiredInputs;
        this.explanation = explanation;
        this.retrievedContext = retrievedContext != null ? retrievedContext : new ArrayList<>();
        this.calculationResult = calculationResult;
        this.extractedParameters = new HashMap<>();
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

    public String getIntentCode() {
        return intentCode;
    }

    public void setIntentCode(String intentCode) {
        this.intentCode = intentCode;
    }

    public String getRecommendedCalculatorId() {
        return recommendedCalculatorId;
    }

    public void setRecommendedCalculatorId(String recommendedCalculatorId) {
        this.recommendedCalculatorId = recommendedCalculatorId;
    }

    public String getCalculatorName() {
        return calculatorName;
    }

    public void setCalculatorName(String calculatorName) {
        this.calculatorName = calculatorName;
    }

    public List<String> getRequiredInputs() {
        return requiredInputs;
    }

    public void setRequiredInputs(List<String> requiredInputs) {
        this.requiredInputs = requiredInputs;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<String> getRetrievedContext() {
        return retrievedContext;
    }

    public void setRetrievedContext(List<String> retrievedContext) {
        this.retrievedContext = retrievedContext;
    }

    public Object getCalculationResult() {
        return calculationResult;
    }

    public void setCalculationResult(Object calculationResult) {
        this.calculationResult = calculationResult;
    }

    public Map<String, Object> getExtractedParameters() {
        return extractedParameters;
    }

    public void setExtractedParameters(Map<String, Object> extractedParameters) {
        this.extractedParameters = extractedParameters;
    }
}
