-- =============================================
-- Zone module
-- =============================================

CREATE TABLE parking_zones (
    id          UUID PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(500) NOT NULL,
    zone_type   VARCHAR(50)  NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_spaces INTEGER NOT NULL DEFAULT 0,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE parking_spaces (
    id           UUID PRIMARY KEY,
    zone_id      UUID NOT NULL REFERENCES parking_zones(id),
    space_number VARCHAR(20) NOT NULL,
    status       VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    floor        INTEGER,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(zone_id, space_number)
);

CREATE INDEX idx_parking_spaces_zone_id ON parking_spaces(zone_id);
CREATE INDEX idx_parking_spaces_status ON parking_spaces(status);

-- =============================================
-- User module
-- =============================================

CREATE TABLE app_users (
    id           UUID PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
    id            UUID PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES app_users(id),
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    make          VARCHAR(100),
    model         VARCHAR(100),
    color         VARCHAR(50),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);

-- =============================================
-- Reservation module
-- =============================================

CREATE TABLE reservations (
    id            UUID PRIMARY KEY,
    user_id       UUID NOT NULL,
    vehicle_id    UUID NOT NULL,
    zone_id       UUID NOT NULL,
    space_id      UUID NOT NULL,
    status        VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    start_time    TIMESTAMP NOT NULL,
    end_time      TIMESTAMP NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    cancelled_at  TIMESTAMP
);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_space_id ON reservations(space_id);
CREATE INDEX idx_reservations_status ON reservations(status);

-- =============================================
-- Session module
-- =============================================

CREATE TABLE parking_sessions (
    id               UUID PRIMARY KEY,
    user_id          UUID NOT NULL,
    vehicle_id       UUID NOT NULL,
    zone_id          UUID NOT NULL,
    space_id         UUID NOT NULL,
    reservation_id   UUID,
    status           VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    start_time       TIMESTAMP NOT NULL,
    end_time         TIMESTAMP,
    duration_minutes BIGINT,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON parking_sessions(user_id);
CREATE INDEX idx_sessions_space_id ON parking_sessions(space_id);
CREATE INDEX idx_sessions_status ON parking_sessions(status);

-- =============================================
-- Billing module
-- =============================================

CREATE TABLE invoices (
    id               UUID PRIMARY KEY,
    session_id       UUID NOT NULL UNIQUE,
    user_id          UUID NOT NULL,
    amount           DECIMAL(10,2) NOT NULL,
    currency         VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status           VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    duration_minutes BIGINT NOT NULL,
    hourly_rate      DECIMAL(10,2) NOT NULL,
    zone_name        VARCHAR(255),
    issued_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    paid_at          TIMESTAMP
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_session_id ON invoices(session_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE payment_records (
    id                    UUID PRIMARY KEY,
    invoice_id            UUID NOT NULL REFERENCES invoices(id),
    user_id               UUID NOT NULL,
    amount                DECIMAL(10,2) NOT NULL,
    currency              VARCHAR(3) NOT NULL DEFAULT 'EUR',
    payment_method        VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(255),
    successful            BOOLEAN NOT NULL,
    failure_reason        VARCHAR(500),
    processed_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice_id ON payment_records(invoice_id);
CREATE INDEX idx_payments_user_id ON payment_records(user_id);
