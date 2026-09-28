package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class EmiRequestDto {

    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be greater than zero")
    private Double principal;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate cannot be negative")
    private Double annualInterestRate;

    @NotNull(message = "Tenure is required")
    @Positive(message = "Tenure must be greater than zero")
    private Integer tenureValue;

    private String tenureUnit = "YEARS"; // "YEARS" or "MONTHS"

    public EmiRequestDto() {}

    public EmiRequestDto(Double principal, Double annualInterestRate, Integer tenureValue, String tenureUnit) {
        this.principal = principal;
        this.annualInterestRate = annualInterestRate;
        this.tenureValue = tenureValue;
        this.tenureUnit = tenureUnit != null ? tenureUnit : "YEARS";
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

    public Integer getTenureValue() {
        return tenureValue;
    }

    public void setTenureValue(Integer tenureValue) {
        this.tenureValue = tenureValue;
    }

    public String getTenureUnit() {
        return tenureUnit;
    }

    public void setTenureUnit(String tenureUnit) {
        this.tenureUnit = tenureUnit;
    }
}
