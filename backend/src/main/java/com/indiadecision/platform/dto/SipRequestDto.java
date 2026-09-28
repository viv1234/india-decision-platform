package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SipRequestDto {

    @NotNull(message = "Monthly investment amount is required")
    @Positive(message = "Monthly investment must be greater than zero")
    private Double monthlyInvestment;

    @NotNull(message = "Expected annual return is required")
    @Min(value = 0, message = "Expected return cannot be negative")
    private Double expectedAnnualReturn;

    @NotNull(message = "Investment duration is required")
    @Positive(message = "Duration must be greater than zero")
    private Integer durationYears;

    public SipRequestDto() {}

    public SipRequestDto(Double monthlyInvestment, Double expectedAnnualReturn, Integer durationYears) {
        this.monthlyInvestment = monthlyInvestment;
        this.expectedAnnualReturn = expectedAnnualReturn;
        this.durationYears = durationYears;
    }

    public Double getMonthlyInvestment() {
        return monthlyInvestment;
    }

    public void setMonthlyInvestment(Double monthlyInvestment) {
        this.monthlyInvestment = monthlyInvestment;
    }

    public Double getExpectedAnnualReturn() {
        return expectedAnnualReturn;
    }

    public void setExpectedAnnualReturn(Double expectedAnnualReturn) {
        this.expectedAnnualReturn = expectedAnnualReturn;
    }

    public Integer getDurationYears() {
        return durationYears;
    }

    public void setDurationYears(Integer durationYears) {
        this.durationYears = durationYears;
    }
}
