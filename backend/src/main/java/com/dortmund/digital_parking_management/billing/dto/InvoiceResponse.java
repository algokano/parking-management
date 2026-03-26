package com.dortmund.digital_parking_management.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.billing.Invoice;
import com.dortmund.digital_parking_management.billing.model.InvoiceStatus;

public record InvoiceResponse(
        UUID id,
        UUID sessionId,
        UUID userId,
        BigDecimal amount,
        String currency,
        InvoiceStatus status,
        Long durationMinutes,
        BigDecimal hourlyRate,
        String zoneName,
        LocalDateTime issuedAt,
        LocalDateTime paidAt
) {

    public static InvoiceResponse from(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(), invoice.getSessionId(), invoice.getUserId(),
                invoice.getAmount(), invoice.getCurrency(), invoice.getStatus(),
                invoice.getDurationMinutes(), invoice.getHourlyRate(), invoice.getZoneName(),
                invoice.getIssuedAt(), invoice.getPaidAt()
        );
    }
}
