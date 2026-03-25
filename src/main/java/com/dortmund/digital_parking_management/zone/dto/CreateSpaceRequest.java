package com.dortmund.digital_parking_management.zone.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSpaceRequest(
        @NotBlank String spaceNumber,
        Integer floor
) {
}
