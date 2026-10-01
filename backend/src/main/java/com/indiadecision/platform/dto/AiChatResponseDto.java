package com.indiadecision.platform.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiChatResponseDto {
    private String conversationId;
    private ChatMessageDto message;
    private AiChatRequestDto.ActiveContextDto updatedContext;

    public AiChatResponseDto() {}

    public AiChatResponseDto(String conversationId, ChatMessageDto message, AiChatRequestDto.ActiveContextDto updatedContext) {
        this.conversationId = conversationId;
        this.message = message;
        this.updatedContext = updatedContext;
    }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public ChatMessageDto getMessage() { return message; }
    public void setMessage(ChatMessageDto message) { this.message = message; }

    public AiChatRequestDto.ActiveContextDto getUpdatedContext() { return updatedContext; }
    public void setUpdatedContext(AiChatRequestDto.ActiveContextDto updatedContext) { this.updatedContext = updatedContext; }

    public static class ChatMessageDto {
        private String id;
        private String sender; // user or assistant
        private String timestamp;
        private String text;
        private String intentCode;
        private String recommendedCalculatorId;
        private String calculatorName;
        private String decisionVerdict;
        private String badgeColor;
        private String changesSummary;
        private Map<String, String> keyMetrics = new HashMap<>();
        private ComparisonDataDto comparisonData;
        private Object calculationResult;
        private Map<String, Object> extractedParameters = new HashMap<>();
        private List<String> followUpQuestions = new ArrayList<>();
        private List<String> retrievedContext = new ArrayList<>();

        public ChatMessageDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public String getIntentCode() { return intentCode; }
        public void setIntentCode(String intentCode) { this.intentCode = intentCode; }

        public String getRecommendedCalculatorId() { return recommendedCalculatorId; }
        public void setRecommendedCalculatorId(String recommendedCalculatorId) { this.recommendedCalculatorId = recommendedCalculatorId; }

        public String getCalculatorName() { return calculatorName; }
        public void setCalculatorName(String calculatorName) { this.calculatorName = calculatorName; }

        public String getDecisionVerdict() { return decisionVerdict; }
        public void setDecisionVerdict(String decisionVerdict) { this.decisionVerdict = decisionVerdict; }

        public String getBadgeColor() { return badgeColor; }
        public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

        public String getChangesSummary() { return changesSummary; }
        public void setChangesSummary(String changesSummary) { this.changesSummary = changesSummary; }

        public Map<String, String> getKeyMetrics() { return keyMetrics; }
        public void setKeyMetrics(Map<String, String> keyMetrics) { this.keyMetrics = keyMetrics; }

        public ComparisonDataDto getComparisonData() { return comparisonData; }
        public void setComparisonData(ComparisonDataDto comparisonData) { this.comparisonData = comparisonData; }

        public Object getCalculationResult() { return calculationResult; }
        public void setCalculationResult(Object calculationResult) { this.calculationResult = calculationResult; }

        public Map<String, Object> getExtractedParameters() { return extractedParameters; }
        public void setExtractedParameters(Map<String, Object> extractedParameters) { this.extractedParameters = extractedParameters; }

        public List<String> getFollowUpQuestions() { return followUpQuestions; }
        public void setFollowUpQuestions(List<String> followUpQuestions) { this.followUpQuestions = followUpQuestions; }

        public List<String> getRetrievedContext() { return retrievedContext; }
        public void setRetrievedContext(List<String> retrievedContext) { this.retrievedContext = retrievedContext; }
    }

    public static class ComparisonDataDto {
        private String title;
        private ScenarioDto scenarioA;
        private ScenarioDto scenarioB;
        private List<String> comparisonHighlights = new ArrayList<>();

        public ComparisonDataDto() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public ScenarioDto getScenarioA() { return scenarioA; }
        public void setScenarioA(ScenarioDto scenarioA) { this.scenarioA = scenarioA; }

        public ScenarioDto getScenarioB() { return scenarioB; }
        public void setScenarioB(ScenarioDto scenarioB) { this.scenarioB = scenarioB; }

        public List<String> getComparisonHighlights() { return comparisonHighlights; }
        public void setComparisonHighlights(List<String> comparisonHighlights) { this.comparisonHighlights = comparisonHighlights; }
    }

    public static class ScenarioDto {
        private String name;
        private Map<String, String> metrics = new HashMap<>();

        public ScenarioDto() {}
        public ScenarioDto(String name, Map<String, String> metrics) {
            this.name = name;
            this.metrics = metrics;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Map<String, String> getMetrics() { return metrics; }
        public void setMetrics(Map<String, String> metrics) { this.metrics = metrics; }
    }
}
