package com.dortmund.digital_parking_management.shared;

import java.time.Instant;

public record ErrorResponse(String message, String code, Instant timestamp) {

    public static ErrorResponse of(String message, String code) {
        return new ErrorResponse(message, code, Instant.now());
    }
}
