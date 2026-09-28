package com.indiadecision.platform.service.ai;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CalculatorToolRegistry {

    private final Map<String, AiToolDescriptor> toolMap = new HashMap<>();

    public CalculatorToolRegistry() {
        registerTools();
    }

    private void registerTools() {
        toolMap.put("emi", new AiToolDescriptor(
                "EMI Calculator Tool",
                "Calculates loan monthly EMI, interest total and repayment schedule.",
                List.of("principal", "annualInterestRate", "tenureValue"),
                List.of("tenureUnit")
        ));
        toolMap.put("sip", new AiToolDescriptor(
                "SIP Investment Tool",
                "Calculates future wealth value and expected returns from monthly mutual fund SIPs.",
                List.of("monthlyInvestment", "expectedAnnualReturn", "durationYears"),
                List.of()
        ));
        toolMap.put("salary", new AiToolDescriptor(
                "Salary / CTC Tool",
                "Calculates in-hand monthly take home salary from annual CTC.",
                List.of("annualCtc"),
                List.of("basicMonthly", "employeePfMonthly", "professionalTaxMonthly")
        ));
        toolMap.put("rent-affordability", new AiToolDescriptor(
                "Rent Affordability Tool",
                "Calculates rent-to-income budget ratio and affordability indication.",
                List.of("monthlyIncome", "monthlyRent"),
                List.of("existingMonthlyEmi", "otherMonthlyExpenses")
        ));
    }

    public AiToolDescriptor getDescriptor(String toolCode) {
        return toolMap.get(toolCode);
    }

    public Map<String, AiToolDescriptor> getAllDescriptors() {
        return toolMap;
    }
}
