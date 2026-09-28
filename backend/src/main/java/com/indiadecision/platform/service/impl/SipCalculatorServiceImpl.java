package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.SipRequestDto;
import com.indiadecision.platform.dto.SipResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.SipCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class SipCalculatorServiceImpl implements SipCalculatorService {

    @Override
    public SipResponseDto calculateSip(SipRequestDto request) {
        if (request.getMonthlyInvestment() == null || request.getMonthlyInvestment() <= 0) {
            throw new InvalidInputException("Monthly investment must be greater than zero");
        }
        if (request.getExpectedAnnualReturn() == null || request.getExpectedAnnualReturn() < 0) {
            throw new InvalidInputException("Expected return cannot be negative");
        }
        if (request.getDurationYears() == null || request.getDurationYears() <= 0) {
            throw new InvalidInputException("Duration must be greater than zero");
        }

        double p = request.getMonthlyInvestment();
        double annualReturn = request.getExpectedAnnualReturn();
        int years = request.getDurationYears();
        int totalMonths = years * 12;

        double futureValue;
        double totalInvested = p * totalMonths;

        if (annualReturn == 0) {
            futureValue = totalInvested;
        } else {
            double i = annualReturn / 12 / 100;
            futureValue = p * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
        }

        double estimatedReturns = futureValue - totalInvested;

        List<SipResponseDto.YearlyGrowthItem> yearlyGrowth = new ArrayList<>();
        double i = annualReturn / 12 / 100;

        for (int y = 1; y <= years; y++) {
            int monthsSoFar = y * 12;
            double invested = p * monthsSoFar;
            double valSoFar;
            if (annualReturn == 0) {
                valSoFar = invested;
            } else {
                valSoFar = p * ((Math.pow(1 + i, monthsSoFar) - 1) / i) * (1 + i);
            }
            yearlyGrowth.add(new SipResponseDto.YearlyGrowthItem(
                    y,
                    roundTwoDecimals(invested),
                    roundTwoDecimals(valSoFar)
            ));
        }

        SipResponseDto response = new SipResponseDto(
                roundTwoDecimals(totalInvested),
                roundTwoDecimals(estimatedReturns),
                roundTwoDecimals(futureValue)
        );
        response.setYearlyGrowth(yearlyGrowth);
        return response;
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
