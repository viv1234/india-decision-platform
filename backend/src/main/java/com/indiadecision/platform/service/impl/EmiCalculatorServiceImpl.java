package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.EmiRequestDto;
import com.indiadecision.platform.dto.EmiResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.EmiCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmiCalculatorServiceImpl implements EmiCalculatorService {

    @Override
    public EmiResponseDto calculateEmi(EmiRequestDto request) {
        if (request.getPrincipal() == null || request.getPrincipal() <= 0) {
            throw new InvalidInputException("Loan amount must be greater than zero");
        }
        if (request.getAnnualInterestRate() == null || request.getAnnualInterestRate() < 0) {
            throw new InvalidInputException("Interest rate cannot be negative");
        }
        if (request.getTenureValue() == null || request.getTenureValue() <= 0) {
            throw new InvalidInputException("Loan tenure must be greater than zero");
        }

        double p = request.getPrincipal();
        double annualRate = request.getAnnualInterestRate();
        int totalMonths = "MONTHS".equalsIgnoreCase(request.getTenureUnit())
                ? request.getTenureValue()
                : request.getTenureValue() * 12;

        if (totalMonths <= 0) {
            throw new InvalidInputException("Total tenure in months must be greater than zero");
        }

        double monthlyEmi;
        double totalInterest;
        double totalPayment;

        if (annualRate == 0) {
            monthlyEmi = p / totalMonths;
            totalPayment = p;
            totalInterest = 0.0;
        } else {
            double r = annualRate / 12 / 100; // monthly rate
            monthlyEmi = p * r * Math.pow(1 + r, totalMonths) / (Math.pow(1 + r, totalMonths) - 1);
            totalPayment = monthlyEmi * totalMonths;
            totalInterest = totalPayment - p;
        }

        double principalPercentage = roundTwoDecimals((p / totalPayment) * 100);
        double interestPercentage = roundTwoDecimals((totalInterest / totalPayment) * 100);

        List<EmiResponseDto.AmortizationScheduleItem> schedule = new ArrayList<>();
        double balance = p;
        double monthlyRate = annualRate / 12 / 100;

        for (int m = 1; m <= Math.min(totalMonths, 360); m++) {
            double interestForMonth = annualRate == 0 ? 0 : balance * monthlyRate;
            double principalForMonth = monthlyEmi - interestForMonth;
            balance = Math.max(0, balance - principalForMonth);

            schedule.add(new EmiResponseDto.AmortizationScheduleItem(
                    m,
                    roundTwoDecimals(principalForMonth),
                    roundTwoDecimals(interestForMonth),
                    roundTwoDecimals(balance)
            ));
        }

        EmiResponseDto response = new EmiResponseDto(
                roundTwoDecimals(monthlyEmi),
                roundTwoDecimals(totalInterest),
                roundTwoDecimals(totalPayment),
                roundTwoDecimals(p),
                principalPercentage,
                interestPercentage
        );
        response.setSchedule(schedule);
        return response;
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
