package com.dortmund.digital_parking_management.session;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import com.dortmund.digital_parking_management.session.model.SessionStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_sessions")
public class ParkingSession {

    @Id
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "vehicle_id")
    private UUID vehicleId;

    @Column(name = "zone_id")
    private UUID zoneId;

    @Column(name = "space_id")
    private UUID spaceId;

    @Column(name = "reservation_id")
    private UUID reservationId;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "duration_minutes")
    private Long durationMinutes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected ParkingSession() {
    }

    public ParkingSession(UUID userId, UUID vehicleId, UUID zoneId, UUID spaceId, UUID reservationId) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.vehicleId = vehicleId;
        this.zoneId = zoneId;
        this.spaceId = spaceId;
        this.reservationId = reservationId;
        this.status = SessionStatus.ACTIVE;
        this.startTime = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public UUID getVehicleId() { return vehicleId; }
    public UUID getZoneId() { return zoneId; }
    public UUID getSpaceId() { return spaceId; }
    public UUID getReservationId() { return reservationId; }
    public SessionStatus getStatus() { return status; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public Long getDurationMinutes() { return durationMinutes; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void complete() {
        this.endTime = LocalDateTime.now();
        this.durationMinutes = ChronoUnit.MINUTES.between(this.startTime, this.endTime);
        if (this.durationMinutes < 1) {
            this.durationMinutes = 1L;
        }
        this.status = SessionStatus.COMPLETED;
    }
}
