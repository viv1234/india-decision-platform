package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class InflationRequestDto {

    @NotNull(message = "Current amount is required")
    @Positive(message = "Current amount must be greater than zero")
    private Double currentAmount;

    @NotNull(message = "Inflation rate is required")
    @Min(value = 0, message = "Inflation rate cannot be negative")
    private Double inflationRate;

    @NotNull(message = "Number of years is required")
    @Positive(message = "Number of years must be greater than zero")
    private Integer years;

    public InflationRequestDto() {}

    public InflationRequestDto(Double currentAmount, Double inflationRate, Integer years) {
        this.currentAmount = currentAmount;
        this.inflationRate = inflationRate;
        this.years = years;
    }

    public Double getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(Double currentAmount) {
        this.currentAmount = currentAmount;
    }

    public Double getInflationRate() {
        return inflationRate;
    }

    public void setInflationRate(Double inflationRate) {
        this.inflationRate = inflationRate;
    }

    public Integer getYears() {
        return years;
    }

    public void setYears(Integer years) {
        this.years = years;
    }
}
