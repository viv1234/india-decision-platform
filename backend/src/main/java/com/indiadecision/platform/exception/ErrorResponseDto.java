package com.indiadecision.platform.exception;

import java.time.Instant;
import java.util.Map;

public class ErrorResponseDto {
    private boolean success;
    private String message;
    private String code;
    private Map<String, String> errors;
    private Instant timestamp;

    public ErrorResponseDto() {
        this.success = false;
        this.timestamp = Instant.now();
    }

    public ErrorResponseDto(String message, String code) {
        this.success = false;
        this.message = message;
        this.code = code;
        this.timestamp = Instant.now();
    }

    public ErrorResponseDto(String message, String code, Map<String, String> errors) {
        this.success = false;
        this.message = message;
        this.code = code;
        this.errors = errors;
        this.timestamp = Instant.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
