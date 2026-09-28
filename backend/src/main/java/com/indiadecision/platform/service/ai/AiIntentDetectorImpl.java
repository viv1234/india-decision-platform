package com.indiadecision.platform.service.ai;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class AiIntentDetectorImpl implements AiIntentDetector {

    @Override
    public AiIntentResult detectIntent(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return new AiIntentResult(AiIntent.UNKNOWN, "emi", List.of("principal", "annualInterestRate", "tenureValue"), "No query specified.");
        }

        String lower = prompt.toLowerCase(Locale.ROOT);

        if (lower.contains("car") || lower.contains("vehicle") || lower.contains("afford")) {
            return new AiIntentResult(
                    AiIntent.CAR_AFFORDABILITY,
                    "emi",
                    List.of("principal", "annualInterestRate", "tenureValue"),
                    "Detected decision intent for vehicle / car loan affordability."
            );
        } else if (lower.contains("rent") || lower.contains("flat") || lower.contains("house")) {
            return new AiIntentResult(
                    AiIntent.RENT_AFFORDABILITY,
                    "rent-affordability",
                    List.of("monthlyIncome", "monthlyRent"),
                    "Detected rent affordability and monthly income check intent."
            );
        } else if (lower.contains("salary") || lower.contains("ctc") || lower.contains("in-hand") || lower.contains("in hand")) {
            return new AiIntentResult(
                    AiIntent.SALARY_INHAND,
                    "salary",
                    List.of("annualCtc"),
                    "Detected take-home salary and CTC calculation intent."
            );
        } else if (lower.contains("sip") || lower.contains("mutual fund") || lower.contains("invest")) {
            return new AiIntentResult(
                    AiIntent.SIP_GROWTH,
                    "sip",
                    List.of("monthlyInvestment", "expectedAnnualReturn", "durationYears"),
                    "Detected wealth creation and SIP compounding intent."
            );
        } else if (lower.contains("gst") || lower.contains("tax")) {
            return new AiIntentResult(
                    AiIntent.GST_CALCULATION,
                    "gst",
                    List.of("amount", "gstPercentage"),
                    "Detected Goods and Services Tax calculation intent."
            );
        }

        return new AiIntentResult(
                AiIntent.LOAN_AFFORDABILITY,
                "emi",
                List.of("principal", "annualInterestRate", "tenureValue"),
                "Defaulting to general loan EMI calculation intent."
        );
    }
}
