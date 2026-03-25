package com.dortmund.digital_parking_management.session.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.session.ParkingSession;
import com.dortmund.digital_parking_management.session.model.SessionStatus;

public record SessionResponse(
        UUID id,
        UUID userId,
        UUID vehicleId,
        UUID zoneId,
        UUID spaceId,
        UUID reservationId,
        SessionStatus status,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long durationMinutes,
        LocalDateTime createdAt
) {

    public static SessionResponse from(ParkingSession s) {
        return new SessionResponse(
                s.getId(), s.getUserId(), s.getVehicleId(), s.getZoneId(), s.getSpaceId(),
                s.getReservationId(), s.getStatus(), s.getStartTime(), s.getEndTime(),
                s.getDurationMinutes(), s.getCreatedAt()
        );
    }
}
