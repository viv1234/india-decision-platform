package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.DiscountRequestDto;
import com.indiadecision.platform.dto.DiscountResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.DiscountCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DiscountCalculatorServiceImpl implements DiscountCalculatorService {

    @Override
    public DiscountResponseDto calculateDiscount(DiscountRequestDto request) {
        if (request.getOriginalPrice() == null || request.getOriginalPrice() <= 0) {
            throw new InvalidInputException("Original price must be greater than zero");
        }
        if (request.getDiscountPercentage() == null || request.getDiscountPercentage() < 0 || request.getDiscountPercentage() > 100) {
            throw new InvalidInputException("Discount percentage must be between 0 and 100");
        }

        double original = request.getOriginalPrice();
        double pct = request.getDiscountPercentage();

        double discountAmount = original * (pct / 100.0);
        double finalPrice = original - discountAmount;
        double amountSaved = discountAmount;

        return new DiscountResponseDto(
                roundTwoDecimals(original),
                roundTwoDecimals(pct),
                roundTwoDecimals(discountAmount),
                roundTwoDecimals(finalPrice),
                roundTwoDecimals(amountSaved)
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
