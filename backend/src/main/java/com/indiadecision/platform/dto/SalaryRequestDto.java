package com.indiadecision.platform.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SalaryRequestDto {

    @NotNull(message = "Annual CTC is required")
    @Positive(message = "Annual CTC must be greater than zero")
    private Double annualCtc;

    private Double basicMonthly;
    private Double hraMonthly;
    private Double otherAllowancesMonthly;
    private Double employeePfMonthly;
    private Double professionalTaxMonthly = 200.0;
    private Double otherDeductionsMonthly = 0.0;

    public SalaryRequestDto() {}

    public SalaryRequestDto(Double annualCtc, Double basicMonthly, Double hraMonthly, Double otherAllowancesMonthly, Double employeePfMonthly, Double professionalTaxMonthly, Double otherDeductionsMonthly) {
        this.annualCtc = annualCtc;
        this.basicMonthly = basicMonthly;
        this.hraMonthly = hraMonthly;
        this.otherAllowancesMonthly = otherAllowancesMonthly;
        this.employeePfMonthly = employeePfMonthly;
        this.professionalTaxMonthly = professionalTaxMonthly != null ? professionalTaxMonthly : 200.0;
        this.otherDeductionsMonthly = otherDeductionsMonthly != null ? otherDeductionsMonthly : 0.0;
    }

    public Double getAnnualCtc() {
        return annualCtc;
    }

    public void setAnnualCtc(Double annualCtc) {
        this.annualCtc = annualCtc;
    }

    public Double getBasicMonthly() {
        return basicMonthly;
    }

    public void setBasicMonthly(Double basicMonthly) {
        this.basicMonthly = basicMonthly;
    }

    public Double getHraMonthly() {
        return hraMonthly;
    }

    public void setHraMonthly(Double hraMonthly) {
        this.hraMonthly = hraMonthly;
    }

    public Double getOtherAllowancesMonthly() {
        return otherAllowancesMonthly;
    }

    public void setOtherAllowancesMonthly(Double otherAllowancesMonthly) {
        this.otherAllowancesMonthly = otherAllowancesMonthly;
    }

    public Double getEmployeePfMonthly() {
        return employeePfMonthly;
    }

    public void setEmployeePfMonthly(Double employeePfMonthly) {
        this.employeePfMonthly = employeePfMonthly;
    }

    public Double getProfessionalTaxMonthly() {
        return professionalTaxMonthly;
    }

    public void setProfessionalTaxMonthly(Double professionalTaxMonthly) {
        this.professionalTaxMonthly = professionalTaxMonthly;
    }

    public Double getOtherDeductionsMonthly() {
        return otherDeductionsMonthly;
    }

    public void setOtherDeductionsMonthly(Double otherDeductionsMonthly) {
        this.otherDeductionsMonthly = otherDeductionsMonthly;
    }
}
