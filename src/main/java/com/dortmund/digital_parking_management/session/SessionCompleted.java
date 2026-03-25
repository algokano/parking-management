package com.dortmund.digital_parking_management.session;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record SessionCompleted(
        UUID sessionId,
        UUID userId,
        UUID zoneId,
        UUID spaceId,
        String zoneName,
        BigDecimal hourlyRate,
        LocalDateTime startTime,
        LocalDateTime endTime,
        long durationMinutes
) {
}
