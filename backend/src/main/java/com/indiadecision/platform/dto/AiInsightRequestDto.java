package com.indiadecision.platform.dto;

import java.util.Map;

public class AiInsightRequestDto {
    private String calculatorId;
    private Map<String, Object> inputData;
    private Map<String, Object> resultData;

    public AiInsightRequestDto() {}

    public AiInsightRequestDto(String calculatorId, Map<String, Object> inputData, Map<String, Object> resultData) {
        this.calculatorId = calculatorId;
        this.inputData = inputData;
        this.resultData = resultData;
    }

    public String getCalculatorId() {
        return calculatorId;
    }

    public void setCalculatorId(String calculatorId) {
        this.calculatorId = calculatorId;
    }

    public Map<String, Object> getInputData() {
        return inputData;
    }

    public void setInputData(Map<String, Object> inputData) {
        this.inputData = inputData;
    }

    public Map<String, Object> getResultData() {
        return resultData;
    }

    public void setResultData(Map<String, Object> resultData) {
        this.resultData = resultData;
    }
}
