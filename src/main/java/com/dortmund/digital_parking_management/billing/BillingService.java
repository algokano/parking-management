package com.dortmund.digital_parking_management.billing;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.billing.dto.InvoiceResponse;
import com.dortmund.digital_parking_management.billing.dto.PayInvoiceRequest;
import com.dortmund.digital_parking_management.billing.dto.PaymentResponse;
import com.dortmund.digital_parking_management.billing.gateway.PaymentGateway;
import com.dortmund.digital_parking_management.billing.gateway.PaymentRequest;
import com.dortmund.digital_parking_management.billing.model.InvoiceStatus;
import com.dortmund.digital_parking_management.billing.repository.InvoiceRepository;
import com.dortmund.digital_parking_management.billing.repository.PaymentRecordRepository;
import com.dortmund.digital_parking_management.session.SessionCompleted;
import com.dortmund.digital_parking_management.shared.Defaults;

@Service
@Transactional(readOnly = true)
class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final PaymentGateway paymentGateway;

    BillingService(InvoiceRepository invoiceRepository, PaymentRecordRepository paymentRecordRepository,
                   PaymentGateway paymentGateway) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRecordRepository = paymentRecordRepository;
        this.paymentGateway = paymentGateway;
    }

    @Transactional
    void generateInvoice(SessionCompleted event) {
        // Calculate amount: ceil(durationMinutes / 60) * hourlyRate
        long hours = (long) Math.ceil(event.durationMinutes() / 60.0);
        BigDecimal amount = event.hourlyRate()
                .multiply(BigDecimal.valueOf(hours))
                .setScale(2, RoundingMode.HALF_UP);

        var invoice = new Invoice(
                event.sessionId(), event.userId(), amount, Defaults.DEFAULT_CURRENCY,
                event.durationMinutes(), event.hourlyRate(), event.zoneName());
        invoiceRepository.save(invoice);
    }

    InvoiceResponse getInvoice(UUID invoiceId) {
        return InvoiceResponse.from(findInvoice(invoiceId));
    }

    List<InvoiceResponse> listByUser(UUID userId) {
        return invoiceRepository.findByUserId(userId).stream()
                .map(InvoiceResponse::from).toList();
    }

    @Transactional
    PaymentResponse payInvoice(UUID invoiceId, PayInvoiceRequest request) {
        var invoice = findInvoice(invoiceId);
        if (invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new IllegalStateException("Invoice is not pending. Current status: " + invoice.getStatus());
        }

        var paymentRequest = new PaymentRequest(
                invoice.getId(), invoice.getAmount(), invoice.getCurrency(), request.paymentMethod());
        var result = paymentGateway.processPayment(paymentRequest);

        var paymentRecord = new PaymentRecord(
                invoice.getId(), invoice.getUserId(), invoice.getAmount(), invoice.getCurrency(),
                request.paymentMethod(), result.transactionReference(),
                result.successful(), result.failureReason());
        paymentRecordRepository.save(paymentRecord);

        if (result.successful()) {
            invoice.markPaid();
        } else {
            invoice.markFailed();
        }
        invoiceRepository.save(invoice);

        return PaymentResponse.from(paymentRecord);
    }

    PaymentResponse getPayment(UUID paymentId) {
        var record = paymentRecordRepository.findById(paymentId)
                .orElseThrow(() -> new NoSuchElementException("Payment record not found: " + paymentId));
        return PaymentResponse.from(record);
    }

    private Invoice findInvoice(UUID invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new NoSuchElementException("Invoice not found: " + invoiceId));
    }
}
