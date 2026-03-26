package com.dortmund.digital_parking_management.zone.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.zone.ParkingSpace;
import com.dortmund.digital_parking_management.zone.model.SpaceStatus;

public interface ParkingSpaceRepository extends JpaRepository<ParkingSpace, UUID> {

    List<ParkingSpace> findByZoneId(UUID zoneId);

    List<ParkingSpace> findByZoneIdAndStatus(UUID zoneId, SpaceStatus status);

    int countByZoneIdAndStatus(UUID zoneId, SpaceStatus status);

    int countByZoneId(UUID zoneId);
}
