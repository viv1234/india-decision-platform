package com.indiadecision.platform.dto;

public class RentAffordabilityResponseDto {
    private double monthlyIncome;
    private double monthlyRent;
    private double totalMonthlyObligations;
    private double remainingMonthlyIncome;
    private double rentToIncomeRatio;
    private double totalExpenseRatio;
    private String affordabilityStatus; // "Comfortably Affordable", "Moderate / Stretch", "High Financial Strain"
    private String affordabilityBadgeColor; // "green", "yellow", "red"
    private String recommendation;
    private String disclaimer = "This is a financial indication for budgeting, not professional financial advice.";

    public RentAffordabilityResponseDto() {}

    public RentAffordabilityResponseDto(double monthlyIncome, double monthlyRent, double totalMonthlyObligations, double remainingMonthlyIncome, double rentToIncomeRatio, double totalExpenseRatio, String affordabilityStatus, String affordabilityBadgeColor, String recommendation) {
        this.monthlyIncome = monthlyIncome;
        this.monthlyRent = monthlyRent;
        this.totalMonthlyObligations = totalMonthlyObligations;
        this.remainingMonthlyIncome = remainingMonthlyIncome;
        this.rentToIncomeRatio = rentToIncomeRatio;
        this.totalExpenseRatio = totalExpenseRatio;
        this.affordabilityStatus = affordabilityStatus;
        this.affordabilityBadgeColor = affordabilityBadgeColor;
        this.recommendation = recommendation;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public double getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(double monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public double getTotalMonthlyObligations() {
        return totalMonthlyObligations;
    }

    public void setTotalMonthlyObligations(double totalMonthlyObligations) {
        this.totalMonthlyObligations = totalMonthlyObligations;
    }

    public double getRemainingMonthlyIncome() {
        return remainingMonthlyIncome;
    }

    public void setRemainingMonthlyIncome(double remainingMonthlyIncome) {
        this.remainingMonthlyIncome = remainingMonthlyIncome;
    }

    public double getRentToIncomeRatio() {
        return rentToIncomeRatio;
    }

    public void setRentToIncomeRatio(double rentToIncomeRatio) {
        this.rentToIncomeRatio = rentToIncomeRatio;
    }

    public double getTotalExpenseRatio() {
        return totalExpenseRatio;
    }

    public void setTotalExpenseRatio(double totalExpenseRatio) {
        this.totalExpenseRatio = totalExpenseRatio;
    }

    public String getAffordabilityStatus() {
        return affordabilityStatus;
    }

    public void setAffordabilityStatus(String affordabilityStatus) {
        this.affordabilityStatus = affordabilityStatus;
    }

    public String getAffordabilityBadgeColor() {
        return affordabilityBadgeColor;
    }

    public void setAffordabilityBadgeColor(String affordabilityBadgeColor) {
        this.affordabilityBadgeColor = affordabilityBadgeColor;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
