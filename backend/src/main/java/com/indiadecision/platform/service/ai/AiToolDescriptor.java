package com.indiadecision.platform.service.ai;

import java.util.List;

public class AiToolDescriptor {
    private String toolName;
    private String description;
    private List<String> requiredInputs;
    private List<String> optionalInputs;

    public AiToolDescriptor() {}

    public AiToolDescriptor(String toolName, String description, List<String> requiredInputs, List<String> optionalInputs) {
        this.toolName = toolName;
        this.description = description;
        this.requiredInputs = requiredInputs;
        this.optionalInputs = optionalInputs;
    }

    public String getToolName() {
        return toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getRequiredInputs() {
        return requiredInputs;
    }

    public void setRequiredInputs(List<String> requiredInputs) {
        this.requiredInputs = requiredInputs;
    }

    public List<String> getOptionalInputs() {
        return optionalInputs;
    }

    public void setOptionalInputs(List<String> optionalInputs) {
        this.optionalInputs = optionalInputs;
    }
}
