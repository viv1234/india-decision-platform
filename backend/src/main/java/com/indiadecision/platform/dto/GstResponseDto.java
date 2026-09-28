package com.indiadecision.platform.dto;

public class GstResponseDto {
    private double baseAmount;
    private double gstAmount;
    private double cgst;
    private double sgst;
    private double finalAmount;
    private double gstPercentage;
    private boolean inclusive;

    public GstResponseDto() {}

    public GstResponseDto(double baseAmount, double gstAmount, double cgst, double sgst, double finalAmount, double gstPercentage, boolean inclusive) {
        this.baseAmount = baseAmount;
        this.gstAmount = gstAmount;
        this.cgst = cgst;
        this.sgst = sgst;
        this.finalAmount = finalAmount;
        this.gstPercentage = gstPercentage;
        this.inclusive = inclusive;
    }

    public double getBaseAmount() {
        return baseAmount;
    }

    public void setBaseAmount(double baseAmount) {
        this.baseAmount = baseAmount;
    }

    public double getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(double gstAmount) {
        this.gstAmount = gstAmount;
    }

    public double getCgst() {
        return cgst;
    }

    public void setCgst(double cgst) {
        this.cgst = cgst;
    }

    public double getSgst() {
        return sgst;
    }

    public void setSgst(double sgst) {
        this.sgst = sgst;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public double getGstPercentage() {
        return gstPercentage;
    }

    public void setGstPercentage(double gstPercentage) {
        this.gstPercentage = gstPercentage;
    }

    public boolean isInclusive() {
        return inclusive;
    }

    public void setInclusive(boolean inclusive) {
        this.inclusive = inclusive;
    }
}
