package com.dortmund.digital_parking_management.billing.gateway;

public record PaymentResult(
        boolean successful,
        String transactionReference,
        String failureReason
) {
}
