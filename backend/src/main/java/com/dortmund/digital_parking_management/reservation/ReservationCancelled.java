package com.dortmund.digital_parking_management.reservation;

import java.util.UUID;

public record ReservationCancelled(
        UUID reservationId,
        UUID spaceId
) {
}
