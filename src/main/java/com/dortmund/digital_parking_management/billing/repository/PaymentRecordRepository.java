package com.dortmund.digital_parking_management.billing.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.billing.PaymentRecord;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, UUID> {
}
