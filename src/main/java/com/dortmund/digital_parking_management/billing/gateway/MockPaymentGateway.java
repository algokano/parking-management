package com.dortmund.digital_parking_management.billing.gateway;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResult(true, txRef, null);
    }
}
