package com.dortmund.digital_parking_management.reservation;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationCreated(
        UUID reservationId,
        UUID userId,
        UUID zoneId,
        UUID spaceId,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}
