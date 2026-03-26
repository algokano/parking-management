package com.dortmund.digital_parking_management.reservation;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.reservation.model.ReservationStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "reservations")
public class Reservation {

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

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    protected Reservation() {
    }

    public Reservation(UUID userId, UUID vehicleId, UUID zoneId, UUID spaceId,
                       LocalDateTime startTime, LocalDateTime endTime) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.vehicleId = vehicleId;
        this.zoneId = zoneId;
        this.spaceId = spaceId;
        this.status = ReservationStatus.ACTIVE;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public UUID getVehicleId() { return vehicleId; }
    public UUID getZoneId() { return zoneId; }
    public UUID getSpaceId() { return spaceId; }
    public ReservationStatus getStatus() { return status; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getCancelledAt() { return cancelledAt; }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }
}
