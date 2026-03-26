package com.dortmund.digital_parking_management.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.billing.PaymentRecord;
import com.dortmund.digital_parking_management.billing.model.PaymentMethod;

public record PaymentResponse(
        UUID id,
        UUID invoiceId,
        UUID userId,
        BigDecimal amount,
        String currency,
        PaymentMethod paymentMethod,
        String transactionReference,
        boolean successful,
        String failureReason,
        LocalDateTime processedAt
) {

    public static PaymentResponse from(PaymentRecord record) {
        return new PaymentResponse(
                record.getId(), record.getInvoiceId(), record.getUserId(),
                record.getAmount(), record.getCurrency(), record.getPaymentMethod(),
                record.getTransactionReference(), record.isSuccessful(),
                record.getFailureReason(), record.getProcessedAt()
        );
    }
}
