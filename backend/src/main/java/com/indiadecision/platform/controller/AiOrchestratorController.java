package com.indiadecision.platform.controller;

import com.indiadecision.platform.dto.AiOrchestrationRequestDto;
import com.indiadecision.platform.dto.AiOrchestrationResponseDto;
import com.indiadecision.platform.dto.ApiResponse;
import com.indiadecision.platform.service.ai.AiOrchestratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiOrchestratorController {

    private final AiOrchestratorService aiOrchestratorService;

    public AiOrchestratorController(AiOrchestratorService aiOrchestratorService) {
        this.aiOrchestratorService = aiOrchestratorService;
    }

    @PostMapping("/orchestrate")
    public ResponseEntity<ApiResponse<AiOrchestrationResponseDto>> orchestrate(@RequestBody AiOrchestrationRequestDto request) {
        AiOrchestrationResponseDto response = aiOrchestratorService.orchestrate(request);
        return ResponseEntity.ok(ApiResponse.success(response, "AI decision orchestration complete"));
    }
}
