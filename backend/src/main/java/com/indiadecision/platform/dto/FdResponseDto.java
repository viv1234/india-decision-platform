package com.indiadecision.platform.dto;

public class FdResponseDto {
    private double principal;
    private double interestEarned;
    private double maturityAmount;
    private String compoundingFrequency;

    public FdResponseDto() {}

    public FdResponseDto(double principal, double interestEarned, double maturityAmount, String compoundingFrequency) {
        this.principal = principal;
        this.interestEarned = interestEarned;
        this.maturityAmount = maturityAmount;
        this.compoundingFrequency = compoundingFrequency;
    }

    public double getPrincipal() {
        return principal;
    }

    public void setPrincipal(double principal) {
        this.principal = principal;
    }

    public double getInterestEarned() {
        return interestEarned;
    }

    public void setInterestEarned(double interestEarned) {
        this.interestEarned = interestEarned;
    }

    public double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public String getCompoundingFrequency() {
        return compoundingFrequency;
    }

    public void setCompoundingFrequency(String compoundingFrequency) {
        this.compoundingFrequency = compoundingFrequency;
    }
}
