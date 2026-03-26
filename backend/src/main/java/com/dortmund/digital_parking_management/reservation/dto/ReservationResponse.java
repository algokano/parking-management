package com.dortmund.digital_parking_management.reservation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.reservation.Reservation;
import com.dortmund.digital_parking_management.reservation.model.ReservationStatus;

public record ReservationResponse(
        UUID id,
        UUID userId,
        UUID vehicleId,
        UUID zoneId,
        UUID spaceId,
        ReservationStatus status,
        LocalDateTime startTime,
        LocalDateTime endTime,
        LocalDateTime createdAt,
        LocalDateTime cancelledAt
) {

    public static ReservationResponse from(Reservation r) {
        return new ReservationResponse(
                r.getId(), r.getUserId(), r.getVehicleId(), r.getZoneId(), r.getSpaceId(),
                r.getStatus(), r.getStartTime(), r.getEndTime(), r.getCreatedAt(), r.getCancelledAt()
        );
    }
}
