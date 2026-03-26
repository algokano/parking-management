package com.dortmund.digital_parking_management.zone;

import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.zone.model.SpaceStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_spaces")
public class ParkingSpace {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private ParkingZone zone;

    @Column(name = "space_number")
    private String spaceNumber;

    @Enumerated(EnumType.STRING)
    private SpaceStatus status;

    private Integer floor;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected ParkingSpace() {
    }

    public ParkingSpace(ParkingZone zone, String spaceNumber, Integer floor) {
        this.id = UUID.randomUUID();
        this.zone = zone;
        this.spaceNumber = spaceNumber;
        this.status = SpaceStatus.AVAILABLE;
        this.floor = floor;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public ParkingZone getZone() { return zone; }
    public String getSpaceNumber() { return spaceNumber; }
    public SpaceStatus getStatus() { return status; }
    public Integer getFloor() { return floor; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setStatus(SpaceStatus status) { this.status = status; }
}
