package com.indiadecision.platform.dto;

import java.util.List;

public class CarAffordabilityJourneyResponseDto {
    private double monthlyIncome;
    private double carPrice;
    private double downPayment;
    private double loanAmount;
    private double monthlyEmi;
    private double monthlyFuelCost;
    private double totalMonthlyExpense;
    private double safeMaxEmiThreshold;
    private String riskLevel; // SAFE, MODERATE, HIGH_RISK
    private String badgeColor;
    private String aiDecisionSummary;
    private List<String> financialRuleChecklist;
    private List<String> alternativeOptions;

    public CarAffordabilityJourneyResponseDto() {}

    public CarAffordabilityJourneyResponseDto(
            double monthlyIncome, double carPrice, double downPayment, double loanAmount,
            double monthlyEmi, double monthlyFuelCost, double totalMonthlyExpense,
            double safeMaxEmiThreshold, String riskLevel, String badgeColor,
            String aiDecisionSummary, List<String> financialRuleChecklist, List<String> alternativeOptions) {
        this.monthlyIncome = monthlyIncome;
        this.carPrice = carPrice;
        this.downPayment = downPayment;
        this.loanAmount = loanAmount;
        this.monthlyEmi = monthlyEmi;
        this.monthlyFuelCost = monthlyFuelCost;
        this.totalMonthlyExpense = totalMonthlyExpense;
        this.safeMaxEmiThreshold = safeMaxEmiThreshold;
        this.riskLevel = riskLevel;
        this.badgeColor = badgeColor;
        this.aiDecisionSummary = aiDecisionSummary;
        this.financialRuleChecklist = financialRuleChecklist;
        this.alternativeOptions = alternativeOptions;
    }

    public double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public double getCarPrice() { return carPrice; }
    public void setCarPrice(double carPrice) { this.carPrice = carPrice; }

    public double getDownPayment() { return downPayment; }
    public void setDownPayment(double downPayment) { this.downPayment = downPayment; }

    public double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(double loanAmount) { this.loanAmount = loanAmount; }

    public double getMonthlyEmi() { return monthlyEmi; }
    public void setMonthlyEmi(double monthlyEmi) { this.monthlyEmi = monthlyEmi; }

    public double getMonthlyFuelCost() { return monthlyFuelCost; }
    public void setMonthlyFuelCost(double monthlyFuelCost) { this.monthlyFuelCost = monthlyFuelCost; }

    public double getTotalMonthlyExpense() { return totalMonthlyExpense; }
    public void setTotalMonthlyExpense(double totalMonthlyExpense) { this.totalMonthlyExpense = totalMonthlyExpense; }

    public double getSafeMaxEmiThreshold() { return safeMaxEmiThreshold; }
    public void setSafeMaxEmiThreshold(double safeMaxEmiThreshold) { this.safeMaxEmiThreshold = safeMaxEmiThreshold; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public String getAiDecisionSummary() { return aiDecisionSummary; }
    public void setAiDecisionSummary(String aiDecisionSummary) { this.aiDecisionSummary = aiDecisionSummary; }

    public List<String> getFinancialRuleChecklist() { return financialRuleChecklist; }
    public void setFinancialRuleChecklist(List<String> financialRuleChecklist) { this.financialRuleChecklist = financialRuleChecklist; }

    public List<String> getAlternativeOptions() { return alternativeOptions; }
    public void setAlternativeOptions(List<String> alternativeOptions) { this.alternativeOptions = alternativeOptions; }
}
