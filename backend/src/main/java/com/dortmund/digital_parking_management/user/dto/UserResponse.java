package com.dortmund.digital_parking_management.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.user.AppUser;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        LocalDateTime createdAt
) {

    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getCreatedAt()
        );
    }
}
