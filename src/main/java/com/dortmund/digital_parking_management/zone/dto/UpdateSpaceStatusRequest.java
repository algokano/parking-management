package com.dortmund.digital_parking_management.zone.dto;

import com.dortmund.digital_parking_management.zone.model.SpaceStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateSpaceStatusRequest(
        @NotNull SpaceStatus status
) {
}
