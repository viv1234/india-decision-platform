package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.SalaryRequestDto;
import com.indiadecision.platform.dto.SalaryResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.SalaryCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class SalaryCalculatorServiceImpl implements SalaryCalculatorService {

    @Override
    public SalaryResponseDto calculateSalary(SalaryRequestDto request) {
        if (request.getAnnualCtc() == null || request.getAnnualCtc() <= 0) {
            throw new InvalidInputException("Annual CTC must be greater than zero");
        }

        double annualCtc = request.getAnnualCtc();
        double monthlyGross = annualCtc / 12.0;

        double basicMonthly = request.getBasicMonthly() != null ? request.getBasicMonthly() : monthlyGross * 0.50;
        double pfMonthly = request.getEmployeePfMonthly() != null ? request.getEmployeePfMonthly() : basicMonthly * 0.12;
        double ptMonthly = request.getProfessionalTaxMonthly() != null ? request.getProfessionalTaxMonthly() : 200.0;
        double otherDeductions = request.getOtherDeductionsMonthly() != null ? request.getOtherDeductionsMonthly() : 0.0;

        double totalMonthlyDeductions = pfMonthly + ptMonthly + otherDeductions;
        double monthlyInHand = Math.max(0, monthlyGross - totalMonthlyDeductions);
        double annualDeductions = totalMonthlyDeductions * 12.0;
        double annualInHand = monthlyInHand * 12.0;

        return new SalaryResponseDto(
                roundTwoDecimals(annualCtc),
                roundTwoDecimals(monthlyGross),
                roundTwoDecimals(pfMonthly),
                roundTwoDecimals(ptMonthly),
                roundTwoDecimals(otherDeductions),
                roundTwoDecimals(totalMonthlyDeductions),
                roundTwoDecimals(monthlyInHand),
                roundTwoDecimals(annualDeductions),
                roundTwoDecimals(annualInHand)
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
