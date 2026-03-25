package com.dortmund.digital_parking_management.user.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.user.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    boolean existsByEmail(String email);
}
