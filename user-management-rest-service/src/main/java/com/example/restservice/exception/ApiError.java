package com.example.restservice.exception;

import java.time.LocalDateTime;

public class ApiError {
    private String errorType;
    private LocalDateTime timestamp;

    public ApiError(String errorType) {
        this.errorType = errorType;
        this.timestamp = LocalDateTime.now();
    }

    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
