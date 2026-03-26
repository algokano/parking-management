package com.dortmund.digital_parking_management.billing.gateway;

import java.math.BigDecimal;
import java.util.UUID;

import com.dortmund.digital_parking_management.billing.model.PaymentMethod;

public record PaymentRequest(
        UUID invoiceId,
        BigDecimal amount,
        String currency,
        PaymentMethod paymentMethod
) {
}
