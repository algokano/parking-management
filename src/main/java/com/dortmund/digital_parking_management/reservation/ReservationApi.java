package com.dortmund.digital_parking_management.reservation;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.reservation.dto.CreateReservationRequest;
import com.dortmund.digital_parking_management.reservation.dto.ReservationResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
class ReservationApi {

    private final ReservationService reservationService;

    ReservationApi(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody CreateReservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.createReservation(request));
    }

    @GetMapping("/{reservationId}")
    ReservationResponse getReservation(@PathVariable UUID reservationId) {
        return reservationService.getReservation(reservationId);
    }

    @GetMapping
    List<ReservationResponse> listByUser(@RequestParam UUID userId) {
        return reservationService.listByUser(userId);
    }

    @PostMapping("/{reservationId}/cancel")
    ReservationResponse cancelReservation(@PathVariable UUID reservationId) {
        return reservationService.cancelReservation(reservationId);
    }
}
