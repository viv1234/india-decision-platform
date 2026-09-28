package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.FdRequestDto;
import com.indiadecision.platform.dto.FdResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.FdCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FdCalculatorServiceImpl implements FdCalculatorService {

    @Override
    public FdResponseDto calculateFd(FdRequestDto request) {
        if (request.getPrincipal() == null || request.getPrincipal() <= 0) {
            throw new InvalidInputException("Principal amount must be greater than zero");
        }
        if (request.getAnnualInterestRate() == null || request.getAnnualInterestRate() < 0) {
            throw new InvalidInputException("Interest rate cannot be negative");
        }
        if (request.getTenureYears() == null || request.getTenureYears() <= 0) {
            throw new InvalidInputException("Tenure must be greater than zero");
        }

        double p = request.getPrincipal();
        double r = request.getAnnualInterestRate() / 100;
        int t = request.getTenureYears();

        int n;
        String freq = request.getCompoundingFrequency() != null ? request.getCompoundingFrequency().toUpperCase() : "QUARTERLY";
        switch (freq) {
            case "MONTHLY":
                n = 12;
                break;
            case "HALF_YEARLY":
                n = 2;
                break;
            case "YEARLY":
                n = 1;
                break;
            case "QUARTERLY":
            default:
                n = 4;
                freq = "QUARTERLY";
                break;
        }

        double maturityAmount;
        if (r == 0) {
            maturityAmount = p;
        } else {
            maturityAmount = p * Math.pow(1 + (r / n), n * t);
        }

        double interestEarned = maturityAmount - p;

        return new FdResponseDto(
                roundTwoDecimals(p),
                roundTwoDecimals(interestEarned),
                roundTwoDecimals(maturityAmount),
                freq
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
