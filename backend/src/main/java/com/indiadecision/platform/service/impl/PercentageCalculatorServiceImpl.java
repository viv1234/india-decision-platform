package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.PercentageRequestDto;
import com.indiadecision.platform.dto.PercentageResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.PercentageCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PercentageCalculatorServiceImpl implements PercentageCalculatorService {

    @Override
    public PercentageResponseDto calculatePercentage(PercentageRequestDto request) {
        if (request.getValueX() == null || request.getValueY() == null) {
            throw new InvalidInputException("Both input values X and Y are required");
        }

        String mode = request.getMode() != null ? request.getMode().toUpperCase() : "PERCENTAGE_OF";
        double x = request.getValueX();
        double y = request.getValueY();
        double result;
        String explanation;

        switch (mode) {
            case "PERCENTAGE_INCREASE":
                result = y * (1 + (x / 100.0));
                explanation = String.format("Increasing %.2f by %.2f%% equals %.2f", y, x, result);
                break;
            case "PERCENTAGE_DECREASE":
                result = y * (1 - (x / 100.0));
                explanation = String.format("Decreasing %.2f by %.2f%% equals %.2f", y, x, result);
                break;
            case "PERCENTAGE_DIFFERENCE":
                if (x + y == 0) {
                    throw new InvalidInputException("Sum of X and Y cannot be zero for percentage difference calculation");
                }
                double avg = Math.abs(x + y) / 2.0;
                result = (Math.abs(x - y) / avg) * 100.0;
                explanation = String.format("The percentage difference between %.2f and %.2f is %.2f%%", x, y, result);
                break;
            case "PERCENTAGE_OF":
            default:
                mode = "PERCENTAGE_OF";
                result = (x / 100.0) * y;
                explanation = String.format("%.2f%% of %.2f is %.2f", x, y, result);
                break;
        }

        return new PercentageResponseDto(
                mode,
                x,
                y,
                roundTwoDecimals(result),
                explanation
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
