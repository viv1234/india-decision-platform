package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.InflationRequestDto;
import com.indiadecision.platform.dto.InflationResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.InflationCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class InflationCalculatorServiceImpl implements InflationCalculatorService {

    @Override
    public InflationResponseDto calculateInflation(InflationRequestDto request) {
        if (request.getCurrentAmount() == null || request.getCurrentAmount() <= 0) {
            throw new InvalidInputException("Current amount must be greater than zero");
        }
        if (request.getInflationRate() == null || request.getInflationRate() < 0) {
            throw new InvalidInputException("Inflation rate cannot be negative");
        }
        if (request.getYears() == null || request.getYears() <= 0) {
            throw new InvalidInputException("Years must be greater than zero");
        }

        double amt = request.getCurrentAmount();
        double rate = request.getInflationRate();
        int years = request.getYears();

        double futureEquivalent = amt * Math.pow(1 + (rate / 100.0), years);
        double purchasingPowerEquivalent = amt / Math.pow(1 + (rate / 100.0), years);
        double purchasingPowerLossPct = ((amt - purchasingPowerEquivalent) / amt) * 100.0;

        return new InflationResponseDto(
                roundTwoDecimals(amt),
                roundTwoDecimals(futureEquivalent),
                roundTwoDecimals(purchasingPowerEquivalent),
                roundTwoDecimals(purchasingPowerLossPct),
                rate,
                years
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
