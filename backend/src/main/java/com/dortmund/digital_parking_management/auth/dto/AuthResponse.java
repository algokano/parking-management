package com.dortmund.digital_parking_management.auth.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        UUID userId,
        String email,
        String firstName,
        String lastName,
        String role
) {
}
