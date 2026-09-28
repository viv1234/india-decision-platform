package com.indiadecision.platform.service.ai;

import com.indiadecision.platform.dto.AiOrchestrationRequestDto;
import com.indiadecision.platform.dto.AiOrchestrationResponseDto;

public interface AiOrchestratorService {
    AiOrchestrationResponseDto orchestrate(AiOrchestrationRequestDto request);
}
