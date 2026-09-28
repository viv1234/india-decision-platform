package com.indiadecision.platform.dto;

public class InflationResponseDto {
    private double currentAmount;
    private double futureEquivalentAmount;
    private double purchasingPowerEquivalent;
    private double purchasingPowerLossPercentage;
    private double inflationRate;
    private int years;
    private String disclaimer = "Calculated figures are estimates based on historical constant compounding and assume constant inflation rates.";

    public InflationResponseDto() {}

    public InflationResponseDto(double currentAmount, double futureEquivalentAmount, double purchasingPowerEquivalent, double purchasingPowerLossPercentage, double inflationRate, int years) {
        this.currentAmount = currentAmount;
        this.futureEquivalentAmount = futureEquivalentAmount;
        this.purchasingPowerEquivalent = purchasingPowerEquivalent;
        this.purchasingPowerLossPercentage = purchasingPowerLossPercentage;
        this.inflationRate = inflationRate;
        this.years = years;
    }

    public double getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(double currentAmount) {
        this.currentAmount = currentAmount;
    }

    public double getFutureEquivalentAmount() {
        return futureEquivalentAmount;
    }

    public void setFutureEquivalentAmount(double futureEquivalentAmount) {
        this.futureEquivalentAmount = futureEquivalentAmount;
    }

    public double getPurchasingPowerEquivalent() {
        return purchasingPowerEquivalent;
    }

    public void setPurchasingPowerEquivalent(double purchasingPowerEquivalent) {
        this.purchasingPowerEquivalent = purchasingPowerEquivalent;
    }

    public double getPurchasingPowerLossPercentage() {
        return purchasingPowerLossPercentage;
    }

    public void setPurchasingPowerLossPercentage(double purchasingPowerLossPercentage) {
        this.purchasingPowerLossPercentage = purchasingPowerLossPercentage;
    }

    public double getInflationRate() {
        return inflationRate;
    }

    public void setInflationRate(double inflationRate) {
        this.inflationRate = inflationRate;
    }

    public int getYears() {
        return years;
    }

    public void setYears(int years) {
        this.years = years;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
