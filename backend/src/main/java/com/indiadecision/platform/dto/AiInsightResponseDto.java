package com.indiadecision.platform.dto;

import java.util.List;

public class AiInsightResponseDto {
    private String healthStatus; // HEALTHY, MODERATE_RISK, HIGH_RISK
    private String badgeColor;   // bg-emerald-500, bg-amber-500, bg-red-500
    private String title;
    private String aiTakeaway;
    private List<String> keyObservations;
    private String recommendedNextTool;

    public AiInsightResponseDto() {}

    public AiInsightResponseDto(String healthStatus, String badgeColor, String title, String aiTakeaway, List<String> keyObservations, String recommendedNextTool) {
        this.healthStatus = healthStatus;
        this.badgeColor = badgeColor;
        this.title = title;
        this.aiTakeaway = aiTakeaway;
        this.keyObservations = keyObservations;
        this.recommendedNextTool = recommendedNextTool;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAiTakeaway() {
        return aiTakeaway;
    }

    public void setAiTakeaway(String aiTakeaway) {
        this.aiTakeaway = aiTakeaway;
    }

    public List<String> getKeyObservations() {
        return keyObservations;
    }

    public void setKeyObservations(List<String> keyObservations) {
        this.keyObservations = keyObservations;
    }

    public String getRecommendedNextTool() {
        return recommendedNextTool;
    }

    public void setRecommendedNextTool(String recommendedNextTool) {
        this.recommendedNextTool = recommendedNextTool;
    }
}
