package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FdRequestDto {

    @NotNull(message = "Principal amount is required")
    @Positive(message = "Principal amount must be greater than zero")
    private Double principal;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate cannot be negative")
    private Double annualInterestRate;

    @NotNull(message = "Tenure is required")
    @Positive(message = "Tenure must be greater than zero")
    private Integer tenureYears;

    private String compoundingFrequency = "QUARTERLY"; // MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY

    public FdRequestDto() {}

    public FdRequestDto(Double principal, Double annualInterestRate, Integer tenureYears, String compoundingFrequency) {
        this.principal = principal;
        this.annualInterestRate = annualInterestRate;
        this.tenureYears = tenureYears;
        this.compoundingFrequency = compoundingFrequency != null ? compoundingFrequency : "QUARTERLY";
    }

    public Double getPrincipal() {
        return principal;
    }

    public void setPrincipal(Double principal) {
        this.principal = principal;
    }

    public Double getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(Double annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public Integer getTenureYears() {
        return tenureYears;
    }

    public void setTenureYears(Integer tenureYears) {
        this.tenureYears = tenureYears;
    }

    public String getCompoundingFrequency() {
        return compoundingFrequency;
    }

    public void setCompoundingFrequency(String compoundingFrequency) {
        this.compoundingFrequency = compoundingFrequency;
    }
}
