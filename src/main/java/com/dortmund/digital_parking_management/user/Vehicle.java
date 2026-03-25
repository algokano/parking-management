package com.dortmund.digital_parking_management.user;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "license_plate", unique = true)
    private String licensePlate;

    private String make;

    private String model;

    private String color;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected Vehicle() {
    }

    public Vehicle(AppUser user, String licensePlate, String make, String model, String color) {
        this.id = UUID.randomUUID();
        this.user = user;
        this.licensePlate = licensePlate;
        this.make = make;
        this.model = model;
        this.color = color;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public AppUser getUser() { return user; }
    public String getLicensePlate() { return licensePlate; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public String getColor() { return color; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
