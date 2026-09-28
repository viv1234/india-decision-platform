package com.indiadecision.platform.dto;

import java.util.List;

public class SipResponseDto {
    private double totalInvestment;
    private double estimatedReturns;
    private double futureValue;
    private String disclaimer = "Returns are estimates based on compounding and not guaranteed.";
    private List<YearlyGrowthItem> yearlyGrowth;

    public SipResponseDto() {}

    public SipResponseDto(double totalInvestment, double estimatedReturns, double futureValue) {
        this.totalInvestment = totalInvestment;
        this.estimatedReturns = estimatedReturns;
        this.futureValue = futureValue;
    }

    public static class YearlyGrowthItem {
        private int year;
        private double investedAmount;
        private double estimatedValue;

        public YearlyGrowthItem() {}

        public YearlyGrowthItem(int year, double investedAmount, double estimatedValue) {
            this.year = year;
            this.investedAmount = investedAmount;
            this.estimatedValue = estimatedValue;
        }

        public int getYear() {
            return year;
        }

        public void setYear(int year) {
            this.year = year;
        }

        public double getInvestedAmount() {
            return investedAmount;
        }

        public void setInvestedAmount(double investedAmount) {
            this.investedAmount = investedAmount;
        }

        public double getEstimatedValue() {
            return estimatedValue;
        }

        public void setEstimatedValue(double estimatedValue) {
            this.estimatedValue = estimatedValue;
        }
    }

    public double getTotalInvestment() {
        return totalInvestment;
    }

    public void setTotalInvestment(double totalInvestment) {
        this.totalInvestment = totalInvestment;
    }

    public double getEstimatedReturns() {
        return estimatedReturns;
    }

    public void setEstimatedReturns(double estimatedReturns) {
        this.estimatedReturns = estimatedReturns;
    }

    public double getFutureValue() {
        return futureValue;
    }

    public void setFutureValue(double futureValue) {
        this.futureValue = futureValue;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }

    public List<YearlyGrowthItem> getYearlyGrowth() {
        return yearlyGrowth;
    }

    public void setYearlyGrowth(List<YearlyGrowthItem> yearlyGrowth) {
        this.yearlyGrowth = yearlyGrowth;
    }
}
