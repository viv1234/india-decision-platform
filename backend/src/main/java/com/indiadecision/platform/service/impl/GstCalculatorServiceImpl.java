package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.GstRequestDto;
import com.indiadecision.platform.dto.GstResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.GstCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class GstCalculatorServiceImpl implements GstCalculatorService {

    @Override
    public GstResponseDto calculateGst(GstRequestDto request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new InvalidInputException("Amount must be greater than zero");
        }
        if (request.getGstPercentage() == null || request.getGstPercentage() <= 0) {
            throw new InvalidInputException("GST percentage must be greater than zero");
        }

        double amount = request.getAmount();
        double rate = request.getGstPercentage();
        boolean inclusive = request.isInclusive();

        double baseAmount;
        double gstAmount;
        double finalAmount;

        if (inclusive) {
            baseAmount = amount / (1 + (rate / 100.0));
            gstAmount = amount - baseAmount;
            finalAmount = amount;
        } else {
            baseAmount = amount;
            gstAmount = amount * (rate / 100.0);
            finalAmount = amount + gstAmount;
        }

        double cgst = gstAmount / 2.0;
        double sgst = gstAmount / 2.0;

        return new GstResponseDto(
                roundTwoDecimals(baseAmount),
                roundTwoDecimals(gstAmount),
                roundTwoDecimals(cgst),
                roundTwoDecimals(sgst),
                roundTwoDecimals(finalAmount),
                rate,
                inclusive
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
