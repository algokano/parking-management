package com.dortmund.digital_parking_management.session.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.session.ParkingSession;
import com.dortmund.digital_parking_management.session.model.SessionStatus;

public interface ParkingSessionRepository extends JpaRepository<ParkingSession, UUID> {

    List<ParkingSession> findByUserId(UUID userId);

    List<ParkingSession> findByUserIdAndStatus(UUID userId, SessionStatus status);
}
