package com.indiadecision.platform.service.ai;

import org.springframework.stereotype.Service;

import java.util.List;

public interface AiIntentDetector {
    AiIntentResult detectIntent(String prompt);

    record AiIntentResult(AiIntent intent, String recommendedCalculatorId, List<String> requiredInputs, String rationale) {}
}
