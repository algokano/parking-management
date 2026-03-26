package com.dortmund.digital_parking_management.reservation.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dortmund.digital_parking_management.reservation.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findByUserId(UUID userId);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.spaceId = :spaceId AND r.status = 'ACTIVE' " +
           "AND r.startTime < :endTime AND r.endTime > :startTime")
    boolean hasOverlappingReservation(@Param("spaceId") UUID spaceId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);
}
