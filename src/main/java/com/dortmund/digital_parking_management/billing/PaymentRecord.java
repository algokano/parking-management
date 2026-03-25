package com.dortmund.digital_parking_management.billing;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.billing.model.PaymentMethod;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_records")
public class PaymentRecord {

    @Id
    private UUID id;

    @Column(name = "invoice_id")
    private UUID invoiceId;

    @Column(name = "user_id")
    private UUID userId;

    private BigDecimal amount;

    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_reference")
    private String transactionReference;

    private boolean successful;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    protected PaymentRecord() {
    }

    public PaymentRecord(UUID invoiceId, UUID userId, BigDecimal amount, String currency,
                         PaymentMethod paymentMethod, String transactionReference,
                         boolean successful, String failureReason) {
        this.id = UUID.randomUUID();
        this.invoiceId = invoiceId;
        this.userId = userId;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.transactionReference = transactionReference;
        this.successful = successful;
        this.failureReason = failureReason;
        this.processedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getInvoiceId() { return invoiceId; }
    public UUID getUserId() { return userId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public String getTransactionReference() { return transactionReference; }
    public boolean isSuccessful() { return successful; }
    public String getFailureReason() { return failureReason; }
    public LocalDateTime getProcessedAt() { return processedAt; }
}
