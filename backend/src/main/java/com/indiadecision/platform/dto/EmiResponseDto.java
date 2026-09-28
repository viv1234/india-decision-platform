package com.indiadecision.platform.dto;

import java.util.List;

public class EmiResponseDto {
    private double monthlyEmi;
    private double totalInterest;
    private double totalPayment;
    private double principalAmount;
    private double principalPercentage;
    private double interestPercentage;
    private List<AmortizationScheduleItem> schedule;

    public EmiResponseDto() {}

    public EmiResponseDto(double monthlyEmi, double totalInterest, double totalPayment, double principalAmount, double principalPercentage, double interestPercentage) {
        this.monthlyEmi = monthlyEmi;
        this.totalInterest = totalInterest;
        this.totalPayment = totalPayment;
        this.principalAmount = principalAmount;
        this.principalPercentage = principalPercentage;
        this.interestPercentage = interestPercentage;
    }

    public static class AmortizationScheduleItem {
        private int month;
        private double principalPaid;
        private double interestPaid;
        private double balanceRemaining;

        public AmortizationScheduleItem() {}

        public AmortizationScheduleItem(int month, double principalPaid, double interestPaid, double balanceRemaining) {
            this.month = month;
            this.principalPaid = principalPaid;
            this.interestPaid = interestPaid;
            this.balanceRemaining = balanceRemaining;
        }

        public int getMonth() {
            return month;
        }

        public void setMonth(int month) {
            this.month = month;
        }

        public double getPrincipalPaid() {
            return principalPaid;
        }

        public void setPrincipalPaid(double principalPaid) {
            this.principalPaid = principalPaid;
        }

        public double getInterestPaid() {
            return interestPaid;
        }

        public void setInterestPaid(double interestPaid) {
            this.interestPaid = interestPaid;
        }

        public double getBalanceRemaining() {
            return balanceRemaining;
        }

        public void setBalanceRemaining(double balanceRemaining) {
            this.balanceRemaining = balanceRemaining;
        }
    }

    public double getMonthlyEmi() {
        return monthlyEmi;
    }

    public void setMonthlyEmi(double monthlyEmi) {
        this.monthlyEmi = monthlyEmi;
    }

    public double getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(double totalInterest) {
        this.totalInterest = totalInterest;
    }

    public double getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(double totalPayment) {
        this.totalPayment = totalPayment;
    }

    public double getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(double principalAmount) {
        this.principalAmount = principalAmount;
    }

    public double getPrincipalPercentage() {
        return principalPercentage;
    }

    public void setPrincipalPercentage(double principalPercentage) {
        this.principalPercentage = principalPercentage;
    }

    public double getInterestPercentage() {
        return interestPercentage;
    }

    public void setInterestPercentage(double interestPercentage) {
        this.interestPercentage = interestPercentage;
    }

    public List<AmortizationScheduleItem> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<AmortizationScheduleItem> schedule) {
        this.schedule = schedule;
    }
}
