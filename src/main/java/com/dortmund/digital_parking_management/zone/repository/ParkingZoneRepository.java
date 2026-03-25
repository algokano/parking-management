package com.dortmund.digital_parking_management.zone.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.zone.ParkingZone;

public interface ParkingZoneRepository extends JpaRepository<ParkingZone, UUID> {
}
