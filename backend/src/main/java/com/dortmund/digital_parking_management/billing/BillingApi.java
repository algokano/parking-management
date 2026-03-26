package com.dortmund.digital_parking_management.billing;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.billing.dto.InvoiceResponse;
import com.dortmund.digital_parking_management.billing.dto.PayInvoiceRequest;
import com.dortmund.digital_parking_management.billing.dto.PaymentResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/billing")
class BillingApi {

    private final BillingService billingService;

    BillingApi(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/invoices/{invoiceId}")
    InvoiceResponse getInvoice(@PathVariable UUID invoiceId) {
        return billingService.getInvoice(invoiceId);
    }

    @GetMapping("/invoices")
    List<InvoiceResponse> listByUser(@RequestParam UUID userId) {
        return billingService.listByUser(userId);
    }

    @PostMapping("/invoices/{invoiceId}/pay")
    PaymentResponse payInvoice(@PathVariable UUID invoiceId, @Valid @RequestBody PayInvoiceRequest request) {
        return billingService.payInvoice(invoiceId, request);
    }

    @GetMapping("/payments/{paymentId}")
    PaymentResponse getPayment(@PathVariable UUID paymentId) {
        return billingService.getPayment(paymentId);
    }
}
