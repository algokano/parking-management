package com.dortmund.digital_parking_management.user.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateVehicleRequest(
        @NotBlank String licensePlate,
        String make,
        String model,
        String color
) {
}
