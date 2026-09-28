package com.indiadecision.platform.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class GstRequestDto {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    @NotNull(message = "GST percentage is required")
    @Positive(message = "GST rate must be greater than zero")
    private Double gstPercentage;

    private boolean inclusive = false;

    public GstRequestDto() {}

    public GstRequestDto(Double amount, Double gstPercentage, boolean inclusive) {
        this.amount = amount;
        this.gstPercentage = gstPercentage;
        this.inclusive = inclusive;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getGstPercentage() {
        return gstPercentage;
    }

    public void setGstPercentage(Double gstPercentage) {
        this.gstPercentage = gstPercentage;
    }

    public boolean isInclusive() {
        return inclusive;
    }

    public void setInclusive(boolean inclusive) {
        this.inclusive = inclusive;
    }
}
