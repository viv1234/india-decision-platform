package com.indiadecision.platform.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiChatRequestDto {
    private String conversationId;
    private String userQuery;
    private ActiveContextDto activeContext;
    private List<HistoryItemDto> history = new ArrayList<>();

    public AiChatRequestDto() {}

    public AiChatRequestDto(String conversationId, String userQuery, ActiveContextDto activeContext, List<HistoryItemDto> history) {
        this.conversationId = conversationId;
        this.userQuery = userQuery;
        this.activeContext = activeContext;
        this.history = history != null ? history : new ArrayList<>();
    }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getUserQuery() { return userQuery; }
    public void setUserQuery(String userQuery) { this.userQuery = userQuery; }

    public ActiveContextDto getActiveContext() { return activeContext; }
    public void setActiveContext(ActiveContextDto activeContext) { this.activeContext = activeContext; }

    public List<HistoryItemDto> getHistory() { return history; }
    public void setHistory(List<HistoryItemDto> history) { this.history = history; }

    public static class ActiveContextDto {
        private String intentCode;
        private String recommendedCalculatorId;
        private Map<String, Object> extractedParameters = new HashMap<>();
        private Object lastCalculationResult;

        public ActiveContextDto() {}

        public String getIntentCode() { return intentCode; }
        public void setIntentCode(String intentCode) { this.intentCode = intentCode; }

        public String getRecommendedCalculatorId() { return recommendedCalculatorId; }
        public void setRecommendedCalculatorId(String recommendedCalculatorId) { this.recommendedCalculatorId = recommendedCalculatorId; }

        public Map<String, Object> getExtractedParameters() { return extractedParameters; }
        public void setExtractedParameters(Map<String, Object> extractedParameters) { this.extractedParameters = extractedParameters; }

        public Object getLastCalculationResult() { return lastCalculationResult; }
        public void setLastCalculationResult(Object lastCalculationResult) { this.lastCalculationResult = lastCalculationResult; }
    }

    public static class HistoryItemDto {
        private String role; // user or assistant
        private String text;

        public HistoryItemDto() {}
        public HistoryItemDto(String role, String text) {
            this.role = role;
            this.text = text;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
}
