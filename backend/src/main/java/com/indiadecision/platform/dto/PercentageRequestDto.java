package com.indiadecision.platform.dto;

import jakarta.validation.constraints.NotNull;

public class PercentageRequestDto {

    private String mode = "PERCENTAGE_OF"; // PERCENTAGE_OF, PERCENTAGE_INCREASE, PERCENTAGE_DECREASE, PERCENTAGE_DIFFERENCE

    @NotNull(message = "Value X is required")
    private Double valueX;

    @NotNull(message = "Value Y is required")
    private Double valueY;

    public PercentageRequestDto() {}

    public PercentageRequestDto(String mode, Double valueX, Double valueY) {
        this.mode = mode != null ? mode : "PERCENTAGE_OF";
        this.valueX = valueX;
        this.valueY = valueY;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Double getValueX() {
        return valueX;
    }

    public void setValueX(Double valueX) {
        this.valueX = valueX;
    }

    public Double getValueY() {
        return valueY;
    }

    public void setValueY(Double valueY) {
        this.valueY = valueY;
    }
}
