package com.dortmund.digital_parking_management.zone.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.zone.ParkingSpace;
import com.dortmund.digital_parking_management.zone.model.SpaceStatus;

public record SpaceResponse(
        UUID id,
        UUID zoneId,
        String spaceNumber,
        SpaceStatus status,
        Integer floor,
        LocalDateTime createdAt
) {

    public static SpaceResponse from(ParkingSpace space) {
        return new SpaceResponse(
                space.getId(),
                space.getZone().getId(),
                space.getSpaceNumber(),
                space.getStatus(),
                space.getFloor(),
                space.getCreatedAt()
        );
    }
}
