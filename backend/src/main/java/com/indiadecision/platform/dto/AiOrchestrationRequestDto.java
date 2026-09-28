package com.indiadecision.platform.dto;

public class AiOrchestrationRequestDto {
    private String userQuery;

    public AiOrchestrationRequestDto() {}

    public AiOrchestrationRequestDto(String userQuery) {
        this.userQuery = userQuery;
    }

    public String getUserQuery() {
        return userQuery;
    }

    public void setUserQuery(String userQuery) {
        this.userQuery = userQuery;
    }
}
