package com.dortmund.digital_parking_management.billing.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dortmund.digital_parking_management.billing.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByUserId(UUID userId);
}
