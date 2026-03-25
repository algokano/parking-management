package com.dortmund.digital_parking_management.billing.gateway;

public interface PaymentGateway {

    PaymentResult processPayment(PaymentRequest request);
}
