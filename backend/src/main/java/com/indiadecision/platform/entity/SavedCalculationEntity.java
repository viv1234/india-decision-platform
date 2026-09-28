package com.indiadecision.platform.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "saved_calculations")
public class SavedCalculationEntity {

    @Id
    private String id = UUID.randomUUID().toString();
    private String userId;
    private String calculatorCode;
    private String title;
    private String inputDataJson;
    private String resultDataJson;
    private String notes;
    private Instant createdAt = Instant.now();

    public SavedCalculationEntity() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCalculatorCode() {
        return calculatorCode;
    }

    public void setCalculatorCode(String calculatorCode) {
        this.calculatorCode = calculatorCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
