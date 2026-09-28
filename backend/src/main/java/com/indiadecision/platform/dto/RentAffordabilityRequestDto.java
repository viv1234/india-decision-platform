package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RentAffordabilityRequestDto {

    @NotNull(message = "Monthly income is required")
    @Positive(message = "Monthly income must be greater than zero")
    private Double monthlyIncome;

    @Min(value = 0, message = "EMI cannot be negative")
    private Double existingMonthlyEmi = 0.0;

    @NotNull(message = "Monthly rent is required")
    @Min(value = 0, message = "Monthly rent cannot be negative")
    private Double monthlyRent;

    @Min(value = 0, message = "Other expenses cannot be negative")
    private Double otherMonthlyExpenses = 0.0;

    public RentAffordabilityRequestDto() {}

    public RentAffordabilityRequestDto(Double monthlyIncome, Double existingMonthlyEmi, Double monthlyRent, Double otherMonthlyExpenses) {
        this.monthlyIncome = monthlyIncome;
        this.existingMonthlyEmi = existingMonthlyEmi != null ? existingMonthlyEmi : 0.0;
        this.monthlyRent = monthlyRent;
        this.otherMonthlyExpenses = otherMonthlyExpenses != null ? otherMonthlyExpenses : 0.0;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Double getExistingMonthlyEmi() {
        return existingMonthlyEmi;
    }

    public void setExistingMonthlyEmi(Double existingMonthlyEmi) {
        this.existingMonthlyEmi = existingMonthlyEmi;
    }

    public Double getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(Double monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public Double getOtherMonthlyExpenses() {
        return otherMonthlyExpenses;
    }

    public void setOtherMonthlyExpenses(Double otherMonthlyExpenses) {
        this.otherMonthlyExpenses = otherMonthlyExpenses;
    }
}
