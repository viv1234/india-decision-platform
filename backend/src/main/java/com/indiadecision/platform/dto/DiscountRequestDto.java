package com.indiadecision.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DiscountRequestDto {

    @NotNull(message = "Original price is required")
    @Positive(message = "Original price must be greater than zero")
    private Double originalPrice;

    @NotNull(message = "Discount percentage is required")
    @Min(value = 0, message = "Discount percentage cannot be negative")
    private Double discountPercentage;

    public DiscountRequestDto() {}

    public DiscountRequestDto(Double originalPrice, Double discountPercentage) {
        this.originalPrice = originalPrice;
        this.discountPercentage = discountPercentage;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
}
