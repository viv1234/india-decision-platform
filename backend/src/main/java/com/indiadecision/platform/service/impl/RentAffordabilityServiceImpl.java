package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.RentAffordabilityRequestDto;
import com.indiadecision.platform.dto.RentAffordabilityResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.RentAffordabilityService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RentAffordabilityServiceImpl implements RentAffordabilityService {

    @Override
    public RentAffordabilityResponseDto calculateRentAffordability(RentAffordabilityRequestDto request) {
        if (request.getMonthlyIncome() == null || request.getMonthlyIncome() <= 0) {
            throw new InvalidInputException("Monthly income must be greater than zero");
        }
        if (request.getMonthlyRent() == null || request.getMonthlyRent() < 0) {
            throw new InvalidInputException("Monthly rent cannot be negative");
        }

        double income = request.getMonthlyIncome();
        double emi = request.getExistingMonthlyEmi() != null ? request.getExistingMonthlyEmi() : 0.0;
        double rent = request.getMonthlyRent();
        double otherExp = request.getOtherMonthlyExpenses() != null ? request.getOtherMonthlyExpenses() : 0.0;

        double totalObligations = emi + rent + otherExp;
        double remainingIncome = income - totalObligations;

        double rentToIncomeRatio = (rent / income) * 100.0;
        double totalExpenseRatio = (totalObligations / income) * 100.0;

        String status;
        String badgeColor;
        String recommendation;

        if (rentToIncomeRatio <= 30.0 && totalExpenseRatio <= 50.0) {
            status = "Comfortably Affordable";
            badgeColor = "green";
            recommendation = "Your rent is well within the ideal 30% household budget limit, leaving healthy room for savings and emergency funds.";
        } else if (rentToIncomeRatio <= 40.0 && totalExpenseRatio <= 70.0) {
            status = "Moderate / Stretch";
            badgeColor = "yellow";
            recommendation = "Rent consumes a notable portion of income. Monitor discretionary spending to maintain savings goals.";
        } else {
            status = "High Financial Strain";
            badgeColor = "red";
            recommendation = "Rent and fixed expenses exceed recommended limits (>40% on rent or >70% total expenses). Consider lower rent options or reducing existing obligations.";
        }

        return new RentAffordabilityResponseDto(
                roundTwoDecimals(income),
                roundTwoDecimals(rent),
                roundTwoDecimals(totalObligations),
                roundTwoDecimals(remainingIncome),
                roundTwoDecimals(rentToIncomeRatio),
                roundTwoDecimals(totalExpenseRatio),
                status,
                badgeColor,
                recommendation
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
