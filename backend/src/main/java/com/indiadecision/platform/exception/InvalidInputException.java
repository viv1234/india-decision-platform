package com.indiadecision.platform.exception;

public class InvalidInputException extends RuntimeException {
    private final String code;

    public InvalidInputException(String message) {
        super(message);
        this.code = "INVALID_INPUT";
    }

    public InvalidInputException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
