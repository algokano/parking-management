package com.dortmund.digital_parking_management.session.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record StartSessionRequest(
        @NotNull UUID userId,
        @NotNull UUID vehicleId,
        @NotNull UUID zoneId,
        @NotNull UUID spaceId,
        UUID reservationId
) {
}
