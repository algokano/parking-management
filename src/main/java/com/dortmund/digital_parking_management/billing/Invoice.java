package com.dortmund.digital_parking_management.billing;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dortmund.digital_parking_management.billing.model.InvoiceStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    private UUID id;

    @Column(name = "session_id", unique = true)
    private UUID sessionId;

    @Column(name = "user_id")
    private UUID userId;

    private BigDecimal amount;

    private String currency;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Column(name = "duration_minutes")
    private Long durationMinutes;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "zone_name")
    private String zoneName;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    protected Invoice() {
    }

    public Invoice(UUID sessionId, UUID userId, BigDecimal amount, String currency,
                   Long durationMinutes, BigDecimal hourlyRate, String zoneName) {
        this.id = UUID.randomUUID();
        this.sessionId = sessionId;
        this.userId = userId;
        this.amount = amount;
        this.currency = currency;
        this.status = InvoiceStatus.PENDING;
        this.durationMinutes = durationMinutes;
        this.hourlyRate = hourlyRate;
        this.zoneName = zoneName;
        this.issuedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getSessionId() { return sessionId; }
    public UUID getUserId() { return userId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public InvoiceStatus getStatus() { return status; }
    public Long getDurationMinutes() { return durationMinutes; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public String getZoneName() { return zoneName; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public LocalDateTime getPaidAt() { return paidAt; }

    public void markPaid() {
        this.status = InvoiceStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void markFailed() {
        this.status = InvoiceStatus.FAILED;
    }
}
