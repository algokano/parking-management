-- =============================================
-- Add authentication columns to app_users
-- =============================================

ALTER TABLE app_users ADD COLUMN password VARCHAR(255);
ALTER TABLE app_users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'CITIZEN';

-- =============================================
-- Seed data: Users (bcrypt-hashed passwords)
-- admin123 / citizen123
-- =============================================

INSERT INTO app_users (id, email, first_name, last_name, phone_number, password, role, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@parking.local', 'Max', 'Mustermann', '+49 231 1234567',
 '$2a$10$FwQowJoHjIRHJTsoH1agvOpUItTiVcmAUrRyv0Ea5MHZv6KUGFVXi', 'ADMIN', NOW()),
('a0000000-0000-0000-0000-000000000002', 'citizen@parking.local', 'Erika', 'Schmidt', '+49 231 9876543',
 '$2a$10$U28ymPy.wEsZddEpKnR32OvaMYfRz/EPJwgcZz6rnZXskILsJ4ejC', 'CITIZEN', NOW());

-- =============================================
-- Seed data: Vehicles
-- =============================================

INSERT INTO vehicles (id, user_id, license_plate, make, model, color, created_at) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'DO-ES 1234', 'Volkswagen', 'Golf', 'Silver', NOW()),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'DO-AB 5678', 'BMW', '3 Series', 'Black', NOW()),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'DO-MM 9999', 'Audi', 'A4', 'White', NOW());

-- =============================================
-- Seed data: Parking Zones (Dortmund locations)
-- =============================================

INSERT INTO parking_zones (id, name, address, zone_type, hourly_rate, total_spaces, latitude, longitude, created_at) VALUES
('c0000000-0000-0000-0000-000000000001', 'Stadtgarten Parkhaus', 'Steinstraße 35, 44147 Dortmund', 'GARAGE', 2.50, 5, 51.5150, 7.4620, NOW()),
('c0000000-0000-0000-0000-000000000002', 'Westenhellweg Straßenparken', 'Westenhellweg 1, 44137 Dortmund', 'STREET', 3.00, 4, 51.5136, 7.4653, NOW()),
('c0000000-0000-0000-0000-000000000003', 'Signal Iduna Park Parkplatz', 'Strobelallee 50, 44139 Dortmund', 'LOT', 1.50, 6, 51.4926, 7.4518, NOW()),
('c0000000-0000-0000-0000-000000000004', 'Thier-Galerie Parkhaus', 'Westenhellweg 102, 44137 Dortmund', 'GARAGE', 2.00, 5, 51.5142, 7.4590, NOW()),
('c0000000-0000-0000-0000-000000000005', 'Phoenixsee Uferparken', 'Phoenixseestraße 1, 44263 Dortmund', 'STREET', 1.00, 4, 51.4890, 7.5110, NOW());

-- =============================================
-- Seed data: Parking Spaces
-- =============================================

-- Stadtgarten Parkhaus (5 spaces)
INSERT INTO parking_spaces (id, zone_id, space_number, status, floor, created_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'SG-A1', 'AVAILABLE', 1, NOW()),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'SG-A2', 'AVAILABLE', 1, NOW()),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'SG-A3', 'OCCUPIED', 1, NOW()),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'SG-B1', 'AVAILABLE', 2, NOW()),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'SG-B2', 'OUT_OF_SERVICE', 2, NOW());

-- Westenhellweg (4 street spaces)
INSERT INTO parking_spaces (id, zone_id, space_number, status, floor, created_at) VALUES
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'WH-01', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'WH-02', 'OCCUPIED', NULL, NOW()),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'WH-03', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002', 'WH-04', 'RESERVED', NULL, NOW());

-- Signal Iduna Park (6 lot spaces)
INSERT INTO parking_spaces (id, zone_id, space_number, status, floor, created_at) VALUES
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'SI-01', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'SI-02', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'SI-03', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003', 'SI-04', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000003', 'SI-05', 'OCCUPIED', NULL, NOW()),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000003', 'SI-06', 'AVAILABLE', NULL, NOW());

-- Thier-Galerie (5 spaces)
INSERT INTO parking_spaces (id, zone_id, space_number, status, floor, created_at) VALUES
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000004', 'TG-A1', 'AVAILABLE', 1, NOW()),
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000004', 'TG-A2', 'OCCUPIED', 1, NOW()),
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000004', 'TG-A3', 'AVAILABLE', 1, NOW()),
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000004', 'TG-B1', 'AVAILABLE', 2, NOW()),
('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000004', 'TG-B2', 'AVAILABLE', 2, NOW());

-- Phoenixsee (4 street spaces)
INSERT INTO parking_spaces (id, zone_id, space_number, status, floor, created_at) VALUES
('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000005', 'PH-01', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000005', 'PH-02', 'AVAILABLE', NULL, NOW()),
('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000005', 'PH-03', 'OCCUPIED', NULL, NOW()),
('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000005', 'PH-04', 'AVAILABLE', NULL, NOW());

-- =============================================
-- Seed data: Reservation (active for citizen)
-- =============================================

INSERT INTO reservations (id, user_id, vehicle_id, zone_id, space_id, status, start_time, end_time, created_at) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000009', 'ACTIVE',
 NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', NOW());

-- =============================================
-- Seed data: Completed session + pending invoice
-- =============================================

INSERT INTO parking_sessions (id, user_id, vehicle_id, zone_id, space_id, reservation_id, status, start_time, end_time, duration_minutes, created_at) VALUES
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', NULL, 'COMPLETED',
 NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', 120, NOW() - INTERVAL '3 hours');

INSERT INTO invoices (id, session_id, user_id, amount, currency, status, duration_minutes, hourly_rate, zone_name, issued_at) VALUES
('f1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
 5.00, 'EUR', 'PENDING', 120, 2.50, 'Stadtgarten Parkhaus', NOW() - INTERVAL '1 hour');

-- Active session for admin (Phoenixsee)
INSERT INTO parking_sessions (id, user_id, vehicle_id, zone_id, space_id, reservation_id, status, start_time, end_time, duration_minutes, created_at) VALUES
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
 'c0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000023', NULL, 'ACTIVE',
 NOW() - INTERVAL '30 minutes', NULL, NULL, NOW() - INTERVAL '30 minutes');
