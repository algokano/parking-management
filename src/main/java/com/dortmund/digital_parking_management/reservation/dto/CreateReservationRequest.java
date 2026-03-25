package com.dortmund.digital_parking_management.reservation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record CreateReservationRequest(
        @NotNull UUID userId,
        @NotNull UUID vehicleId,
        @NotNull UUID zoneId,
        @NotNull UUID spaceId,
        @NotNull @Future LocalDateTime startTime,
        @NotNull @Future LocalDateTime endTime
) {
}
