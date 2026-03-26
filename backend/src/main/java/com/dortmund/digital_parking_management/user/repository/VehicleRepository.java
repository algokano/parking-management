package com.dortmund.digital_parking_management.user.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.user.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    List<Vehicle> findByUserId(UUID userId);

    boolean existsByLicensePlate(String licensePlate);
}
