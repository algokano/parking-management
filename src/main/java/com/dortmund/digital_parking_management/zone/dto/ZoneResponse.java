package com.dortmund.digital_parking_management.zone.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.zone.ParkingZone;
import com.dortmund.digital_parking_management.zone.model.ZoneType;

public record ZoneResponse(
        UUID id,
        String name,
        String address,
        ZoneType zoneType,
        BigDecimal hourlyRate,
        Integer totalSpaces,
        Double latitude,
        Double longitude,
        LocalDateTime createdAt
) {

    public static ZoneResponse from(ParkingZone zone) {
        return new ZoneResponse(
                zone.getId(),
                zone.getName(),
                zone.getAddress(),
                zone.getZoneType(),
                zone.getHourlyRate(),
                zone.getTotalSpaces(),
                zone.getLatitude(),
                zone.getLongitude(),
                zone.getCreatedAt()
        );
    }
}
