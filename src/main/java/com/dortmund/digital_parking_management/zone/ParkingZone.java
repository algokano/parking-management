package com.dortmund.digital_parking_management.zone;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.dortmund.digital_parking_management.zone.model.ZoneType;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_zones")
public class ParkingZone {

    @Id
    private UUID id;

    private String name;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "zone_type")
    private ZoneType zoneType;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "total_spaces")
    private Integer totalSpaces;

    private Double latitude;

    private Double longitude;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParkingSpace> spaces = new ArrayList<>();

    protected ParkingZone() {
    }

    public ParkingZone(String name, String address, ZoneType zoneType, BigDecimal hourlyRate,
                       Double latitude, Double longitude) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.address = address;
        this.zoneType = zoneType;
        this.hourlyRate = hourlyRate;
        this.totalSpaces = 0;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public ZoneType getZoneType() { return zoneType; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public Integer getTotalSpaces() { return totalSpaces; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<ParkingSpace> getSpaces() { return spaces; }

    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setZoneType(ZoneType zoneType) { this.zoneType = zoneType; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public void incrementTotalSpaces() { this.totalSpaces++; }
}
