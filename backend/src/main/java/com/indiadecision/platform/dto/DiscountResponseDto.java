package com.indiadecision.platform.dto;

public class DiscountResponseDto {
    private double originalPrice;
    private double discountPercentage;
    private double discountAmount;
    private double finalPrice;
    private double amountSaved;

    public DiscountResponseDto() {}

    public DiscountResponseDto(double originalPrice, double discountPercentage, double discountAmount, double finalPrice, double amountSaved) {
        this.originalPrice = originalPrice;
        this.discountPercentage = discountPercentage;
        this.discountAmount = discountAmount;
        this.finalPrice = finalPrice;
        this.amountSaved = amountSaved;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public double getAmountSaved() {
        return amountSaved;
    }

    public void setAmountSaved(double amountSaved) {
        this.amountSaved = amountSaved;
    }
}
