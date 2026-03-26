package com.dortmund.digital_parking_management.zone.dto;

import java.math.BigDecimal;

import com.dortmund.digital_parking_management.zone.model.ZoneType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateZoneRequest(
        @NotBlank String name,
        @NotBlank String address,
        @NotNull ZoneType zoneType,
        @NotNull @Positive BigDecimal hourlyRate,
        Double latitude,
        Double longitude
) {
}
