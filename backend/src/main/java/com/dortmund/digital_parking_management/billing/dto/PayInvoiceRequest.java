package com.dortmund.digital_parking_management.billing.dto;

import com.dortmund.digital_parking_management.billing.model.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public record PayInvoiceRequest(
        @NotNull PaymentMethod paymentMethod
) {
}
