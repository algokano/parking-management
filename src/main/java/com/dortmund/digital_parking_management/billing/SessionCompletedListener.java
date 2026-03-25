package com.dortmund.digital_parking_management.billing;

import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import com.dortmund.digital_parking_management.session.SessionCompleted;

@Component
class SessionCompletedListener {

    private final BillingService billingService;

    SessionCompletedListener(BillingService billingService) {
        this.billingService = billingService;
    }

    @ApplicationModuleListener
    void on(SessionCompleted event) {
        billingService.generateInvoice(event);
    }
}
