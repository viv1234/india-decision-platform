package com.indiadecision.platform.service.ai;

public class RagKnowledgeDocument {
    private String id;
    private String category;
    private String title;
    private String content;
    private String sourceRule;
    private double relevanceScore;

    public RagKnowledgeDocument() {}

    public RagKnowledgeDocument(String id, String category, String title, String content, String sourceRule) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.content = content;
        this.sourceRule = sourceRule;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSourceRule() {
        return sourceRule;
    }

    public void setSourceRule(String sourceRule) {
        this.sourceRule = sourceRule;
    }

    public double getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(double relevanceScore) {
        this.relevanceScore = relevanceScore;
    }
}
