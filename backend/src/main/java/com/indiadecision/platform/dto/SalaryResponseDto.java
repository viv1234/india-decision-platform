package com.indiadecision.platform.dto;

public class SalaryResponseDto {
    private double annualCtc;
    private double monthlyGross;
    private double monthlyPfDeduction;
    private double monthlyProfessionalTax;
    private double monthlyOtherDeductions;
    private double totalMonthlyDeductions;
    private double estimatedMonthlyInHand;
    private double annualDeductions;
    private double annualInHand;
    private String disclaimer = "Estimated calculation. Actual salary depends on employer structure, tax regime and applicable rules.";

    public SalaryResponseDto() {}

    public SalaryResponseDto(double annualCtc, double monthlyGross, double monthlyPfDeduction, double monthlyProfessionalTax, double monthlyOtherDeductions, double totalMonthlyDeductions, double estimatedMonthlyInHand, double annualDeductions, double annualInHand) {
        this.annualCtc = annualCtc;
        this.monthlyGross = monthlyGross;
        this.monthlyPfDeduction = monthlyPfDeduction;
        this.monthlyProfessionalTax = monthlyProfessionalTax;
        this.monthlyOtherDeductions = monthlyOtherDeductions;
        this.totalMonthlyDeductions = totalMonthlyDeductions;
        this.estimatedMonthlyInHand = estimatedMonthlyInHand;
        this.annualDeductions = annualDeductions;
        this.annualInHand = annualInHand;
    }

    public double getAnnualCtc() {
        return annualCtc;
    }

    public void setAnnualCtc(double annualCtc) {
        this.annualCtc = annualCtc;
    }

    public double getMonthlyGross() {
        return monthlyGross;
    }

    public void setMonthlyGross(double monthlyGross) {
        this.monthlyGross = monthlyGross;
    }

    public double getMonthlyPfDeduction() {
        return monthlyPfDeduction;
    }

    public void setMonthlyPfDeduction(double monthlyPfDeduction) {
        this.monthlyPfDeduction = monthlyPfDeduction;
    }

    public double getMonthlyProfessionalTax() {
        return monthlyProfessionalTax;
    }

    public void setMonthlyProfessionalTax(double monthlyProfessionalTax) {
        this.monthlyProfessionalTax = monthlyProfessionalTax;
    }

    public double getMonthlyOtherDeductions() {
        return monthlyOtherDeductions;
    }

    public void setMonthlyOtherDeductions(double monthlyOtherDeductions) {
        this.monthlyOtherDeductions = monthlyOtherDeductions;
    }

    public double getTotalMonthlyDeductions() {
        return totalMonthlyDeductions;
    }

    public void setTotalMonthlyDeductions(double totalMonthlyDeductions) {
        this.totalMonthlyDeductions = totalMonthlyDeductions;
    }

    public double getEstimatedMonthlyInHand() {
        return estimatedMonthlyInHand;
    }

    public void setEstimatedMonthlyInHand(double estimatedMonthlyInHand) {
        this.estimatedMonthlyInHand = estimatedMonthlyInHand;
    }

    public double getAnnualDeductions() {
        return annualDeductions;
    }

    public void setAnnualDeductions(double annualDeductions) {
        this.annualDeductions = annualDeductions;
    }

    public double getAnnualInHand() {
        return annualInHand;
    }

    public void setAnnualInHand(double annualInHand) {
        this.annualInHand = annualInHand;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
