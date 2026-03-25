package com.dortmund.digital_parking_management.session;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.reservation.ReservationService;
import com.dortmund.digital_parking_management.session.dto.SessionResponse;
import com.dortmund.digital_parking_management.session.dto.StartSessionRequest;
import com.dortmund.digital_parking_management.session.model.SessionStatus;
import com.dortmund.digital_parking_management.session.repository.ParkingSessionRepository;
import com.dortmund.digital_parking_management.user.UserService;
import com.dortmund.digital_parking_management.zone.ZoneService;

@Service
@Transactional(readOnly = true)
public class SessionService {

    private final ParkingSessionRepository sessionRepository;
    private final ZoneService zoneService;
    private final UserService userService;
    private final ReservationService reservationService;
    private final ApplicationEventPublisher eventPublisher;

    SessionService(ParkingSessionRepository sessionRepository, ZoneService zoneService,
                   UserService userService, ReservationService reservationService,
                   ApplicationEventPublisher eventPublisher) {
        this.sessionRepository = sessionRepository;
        this.zoneService = zoneService;
        this.userService = userService;
        this.reservationService = reservationService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public SessionResponse startSession(StartSessionRequest request) {
        // Validate user and vehicle
        userService.validateUserExists(request.userId());
        userService.validateVehicleBelongsToUser(request.vehicleId(), request.userId());

        if (request.reservationId() != null) {
            // Start with reservation
            var reservation = reservationService.findActiveReservation(request.reservationId());

            if (!reservation.getSpaceId().equals(request.spaceId())) {
                throw new IllegalArgumentException("Space does not match reservation");
            }
            if (!reservation.getUserId().equals(request.userId())) {
                throw new IllegalArgumentException("User does not match reservation");
            }

            // Occupy space via Zone (sole authority)
            zoneService.occupySpace(request.spaceId());

            // Mark reservation as completed
            reservationService.completeReservation(request.reservationId());
        } else {
            // Walk-in: occupy space directly via Zone
            zoneService.occupySpace(request.spaceId());
        }

        var session = new ParkingSession(
                request.userId(), request.vehicleId(), request.zoneId(),
                request.spaceId(), request.reservationId());
        return SessionResponse.from(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse stopSession(UUID sessionId) {
        var session = findSession(sessionId);
        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Session is not active. Current status: " + session.getStatus());
        }

        // Complete the session
        session.complete();

        // Release space via Zone (sole authority)
        zoneService.releaseSpace(session.getSpaceId());

        // Snapshot pricing from Zone
        var hourlyRate = zoneService.getHourlyRate(session.getZoneId());
        var zoneName = zoneService.getZoneName(session.getZoneId());

        session = sessionRepository.save(session);

        // Publish SessionCompleted event with pricing snapshot (consumed by billing)
        eventPublisher.publishEvent(new SessionCompleted(
                session.getId(), session.getUserId(), session.getZoneId(), session.getSpaceId(),
                zoneName, hourlyRate, session.getStartTime(), session.getEndTime(),
                session.getDurationMinutes()));

        return SessionResponse.from(session);
    }

    public SessionResponse getSession(UUID sessionId) {
        return SessionResponse.from(findSession(sessionId));
    }

    public List<SessionResponse> listSessions(UUID userId, SessionStatus status) {
        List<ParkingSession> sessions;
        if (status != null) {
            sessions = sessionRepository.findByUserIdAndStatus(userId, status);
        } else {
            sessions = sessionRepository.findByUserId(userId);
        }
        return sessions.stream().map(SessionResponse::from).toList();
    }

    private ParkingSession findSession(UUID sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found: " + sessionId));
    }
}
