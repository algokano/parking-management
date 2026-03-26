package com.dortmund.digital_parking_management.reservation;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.reservation.dto.CreateReservationRequest;
import com.dortmund.digital_parking_management.reservation.dto.ReservationResponse;
import com.dortmund.digital_parking_management.reservation.model.ReservationStatus;
import com.dortmund.digital_parking_management.reservation.repository.ReservationRepository;
import com.dortmund.digital_parking_management.user.UserService;
import com.dortmund.digital_parking_management.zone.ZoneService;

@Service
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ZoneService zoneService;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    ReservationService(ReservationRepository reservationRepository, ZoneService zoneService,
                       UserService userService, ApplicationEventPublisher eventPublisher) {
        this.reservationRepository = reservationRepository;
        this.zoneService = zoneService;
        this.userService = userService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Validate user and vehicle
        userService.validateUserExists(request.userId());
        userService.validateVehicleBelongsToUser(request.vehicleId(), request.userId());

        // Check for overlapping reservations
        if (reservationRepository.hasOverlappingReservation(request.spaceId(), request.startTime(), request.endTime())) {
            throw new IllegalStateException("Space already has an overlapping reservation for the requested time");
        }

        // Reserve the space via Zone (sole authority on space status)
        zoneService.reserveSpace(request.spaceId());

        // Create reservation
        var reservation = new Reservation(
                request.userId(), request.vehicleId(), request.zoneId(),
                request.spaceId(), request.startTime(), request.endTime());
        reservation = reservationRepository.save(reservation);

        // Publish event
        eventPublisher.publishEvent(new ReservationCreated(
                reservation.getId(), reservation.getUserId(), reservation.getZoneId(),
                reservation.getSpaceId(), reservation.getStartTime(), reservation.getEndTime()));

        return ReservationResponse.from(reservation);
    }

    public ReservationResponse getReservation(UUID reservationId) {
        return ReservationResponse.from(findReservation(reservationId));
    }

    public List<ReservationResponse> listByUser(UUID userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(ReservationResponse::from).toList();
    }

    @Transactional
    public ReservationResponse cancelReservation(UUID reservationId) {
        var reservation = findReservation(reservationId);
        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new IllegalStateException("Only active reservations can be cancelled. Current status: " + reservation.getStatus());
        }

        // Release the space via Zone (sole authority)
        zoneService.releaseSpace(reservation.getSpaceId());

        // Cancel reservation
        reservation.cancel();
        reservation = reservationRepository.save(reservation);

        // Publish event
        eventPublisher.publishEvent(new ReservationCancelled(reservation.getId(), reservation.getSpaceId()));

        return ReservationResponse.from(reservation);
    }

    // ---- Used by Session module ----

    public Reservation findActiveReservation(UUID reservationId) {
        var reservation = findReservation(reservationId);
        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new IllegalStateException("Reservation is not active. Current status: " + reservation.getStatus());
        }
        return reservation;
    }

    @Transactional
    public void completeReservation(UUID reservationId) {
        var reservation = findReservation(reservationId);
        reservation.complete();
        reservationRepository.save(reservation);
    }

    private Reservation findReservation(UUID reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NoSuchElementException("Reservation not found: " + reservationId));
    }
}
