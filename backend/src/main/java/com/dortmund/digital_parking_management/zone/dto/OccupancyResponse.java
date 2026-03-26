package com.dortmund.digital_parking_management.zone.dto;

import java.util.UUID;

public record OccupancyResponse(
        UUID zoneId,
        int total,
        int available,
        int occupied,
        int reserved,
        int outOfService
) {
}
