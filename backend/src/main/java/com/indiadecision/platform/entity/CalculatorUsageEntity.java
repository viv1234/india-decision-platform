package com.indiadecision.platform.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "calculator_usage")
public class CalculatorUsageEntity {

    @Id
    private String id = UUID.randomUUID().toString();
    private String calculatorCode;
    private String sessionId;
    private String userId;
    private String inputDataJson;
    private String resultDataJson;
    private Long executionTimeMs;
    private Instant createdAt = Instant.now();

    public CalculatorUsageEntity() {}

    public CalculatorUsageEntity(String calculatorCode, String sessionId, String inputDataJson, String resultDataJson, Long executionTimeMs) {
        this.calculatorCode = calculatorCode;
        this.sessionId = sessionId;
        this.inputDataJson = inputDataJson;
        this.resultDataJson = resultDataJson;
        this.executionTimeMs = executionTimeMs;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCalculatorCode() {
        return calculatorCode;
    }

    public void setCalculatorCode(String calculatorCode) {
        this.calculatorCode = calculatorCode;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getInputDataJson() {
        return inputDataJson;
    }

    public void setInputDataJson(String inputDataJson) {
        this.inputDataJson = inputDataJson;
    }

    public String getResultDataJson() {
        return resultDataJson;
    }

    public void setResultDataJson(String resultDataJson) {
        this.resultDataJson = resultDataJson;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
