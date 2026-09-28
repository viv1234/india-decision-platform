package com.indiadecision.platform.dto;

import java.util.List;

public class AiOrchestrationResponseDto {
    private String intentCode;
    private String recommendedCalculatorId;
    private String calculatorName;
    private List<String> requiredInputs;
    private String explanation;
    private Object calculationResult;

    public AiOrchestrationResponseDto() {}

    public AiOrchestrationResponseDto(String intentCode, String recommendedCalculatorId, String calculatorName, List<String> requiredInputs, String explanation, Object calculationResult) {
        this.intentCode = intentCode;
        this.recommendedCalculatorId = recommendedCalculatorId;
        this.calculatorName = calculatorName;
        this.requiredInputs = requiredInputs;
        this.explanation = explanation;
        this.calculationResult = calculationResult;
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

    public Object getCalculationResult() {
        return calculationResult;
    }

    public void setCalculationResult(Object calculationResult) {
        this.calculationResult = calculationResult;
    }
}
