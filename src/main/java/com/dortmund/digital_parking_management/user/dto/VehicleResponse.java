package com.dortmund.digital_parking_management.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.user.Vehicle;

public record VehicleResponse(
        UUID id,
        UUID userId,
        String licensePlate,
        String make,
        String model,
        String color,
        LocalDateTime createdAt
) {

    public static VehicleResponse from(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getUser().getId(),
                vehicle.getLicensePlate(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getColor(),
                vehicle.getCreatedAt()
        );
    }
}
