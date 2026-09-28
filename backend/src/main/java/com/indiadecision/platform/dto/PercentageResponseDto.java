package com.indiadecision.platform.dto;

public class PercentageResponseDto {
    private String mode;
    private double valueX;
    private double valueY;
    private double result;
    private String explanation;

    public PercentageResponseDto() {}

    public PercentageResponseDto(String mode, double valueX, double valueY, double result, String explanation) {
        this.mode = mode;
        this.valueX = valueX;
        this.valueY = valueY;
        this.result = result;
        this.explanation = explanation;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public double getValueX() {
        return valueX;
    }

    public void setValueX(double valueX) {
        this.valueX = valueX;
    }

    public double getValueY() {
        return valueY;
    }

    public void setValueY(double valueY) {
        this.valueY = valueY;
    }

    public double getResult() {
        return result;
    }

    public void setResult(double result) {
        this.result = result;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
