# Digital Parking Management System

A full-stack monorepo for managing parking zones, reservations, sessions, and billing in Dortmund.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.0.4, Spring Modulith 2.0.0, Java 17 |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| Database | PostgreSQL 17, Flyway migrations |
| Auth | JWT (stateless), Spring Security, BCrypt |
| Map | Leaflet + OpenStreetMap (no API key) |

## Project Structure

```
digital-parking-management/
├── backend/                         Spring Boot modulith backend
│   ├── src/main/java/.../
│   │   ├── auth/                    JWT authentication & Spring Security
│   │   ├── billing/                 Invoices, payments, payment gateway
│   │   ├── reservation/             Parking reservations & events
│   │   ├── session/                 Parking sessions & SessionCompleted event
│   │   ├── shared/                  Global error handling, constants
│   │   ├── user/                    Users, vehicles, profile
│   │   └── zone/                    Zones, spaces, occupancy
│   ├── src/main/resources/
│   │   ├── application.yaml         App config (DB, JWT, Flyway)
│   │   └── db/migration/            Flyway SQL migrations (V1–V3)
│   ├── postman/                     Postman collection for API testing
│   ├── pom.xml
│   └── mvnw
├── frontend/                        React SPA
│   └── src/
│       ├── api/                     Axios API client + modules per domain
│       ├── context/                 Auth context (JWT, login, logout)
│       ├── components/
│       │   ├── layout/              AppLayout, Sidebar, TopBar
│       │   ├── guards/              ProtectedRoute, AdminRoute
│       │   └── ui/                  StatusBadge, LoadingSpinner, EmptyState
│       ├── pages/
│       │   ├── auth/                Login page
│       │   ├── citizen/             Dashboard, zones, reservations, sessions, invoices, vehicles
│       │   ├── admin/               Admin dashboard, zone CRUD, space management
│       │   └── ProfilePage.tsx      User profile (view & edit)
│       └── types/                   TypeScript interfaces matching backend DTOs
├── docker-compose.yml               PostgreSQL container
└── README.md
```

## Quick Start

### Prerequisites

- Docker (for PostgreSQL)
- Java 17+
- Node.js 18+

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on http://localhost:8080. Flyway auto-creates all tables and seeds demo data on first run.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 with API proxy to backend (no CORS issues in dev).

## Demo Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@parking.local    | admin123    |
| Citizen | citizen@parking.local  | citizen123  |

## Features

### Citizen

- **Dashboard** — summary cards (active sessions, reservations, pending invoices, available zones)
- **Browse Zones** — interactive Leaflet map of Dortmund + zone cards with occupancy bars
- **Zone Detail** — view spaces, reserve a space, or start a walk-in session
- **My Vehicles** — add / remove vehicles
- **My Reservations** — view active reservations, cancel
- **My Sessions** — view active / completed sessions, stop active ones
- **My Invoices** — view invoices, pay pending ones (Credit Card, Debit Card, Wallet)
- **Profile** — view and edit personal information

### Admin

- **Admin Dashboard** — total zones, spaces, occupancy stats per zone, pricing overview
- **Zone Management** — create, edit, delete parking zones
- **Space Management** — add spaces to zones, change space status
- **Profile** — view and edit personal information

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| GET | `/api/auth/me` | Authenticated |

### Zones
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/zones` | Public |
| GET | `/api/zones/{id}` | Public |
| GET | `/api/zones/{id}/occupancy` | Public |
| GET | `/api/zones/{id}/spaces` | Public |
| GET | `/api/zones/{id}/spaces/available` | Public |
| POST | `/api/zones` | Admin |
| PUT | `/api/zones/{id}` | Admin |
| POST | `/api/zones/{id}/spaces` | Admin |
| PATCH | `/api/zones/{id}/spaces/{spaceId}/status` | Admin |

### Users & Vehicles
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users/{id}` | Authenticated |
| PUT | `/api/users/{id}` | Authenticated |
| GET | `/api/users/{id}/vehicles` | Authenticated |
| POST | `/api/users/{id}/vehicles` | Authenticated |
| DELETE | `/api/users/{id}/vehicles/{vehicleId}` | Authenticated |

### Reservations
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/reservations` | Authenticated |
| GET | `/api/reservations?userId={id}` | Authenticated |
| GET | `/api/reservations/{id}` | Authenticated |
| POST | `/api/reservations/{id}/cancel` | Authenticated |

### Sessions
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/sessions/start` | Authenticated |
| POST | `/api/sessions/{id}/stop` | Authenticated |
| GET | `/api/sessions/{id}` | Authenticated |
| GET | `/api/sessions?userId={id}&status=` | Authenticated |

### Billing
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/billing/invoices?userId={id}` | Authenticated |
| GET | `/api/billing/invoices/{id}` | Authenticated |
| POST | `/api/billing/invoices/{id}/pay` | Authenticated |
| GET | `/api/billing/payments/{id}` | Authenticated |

## Seeded Demo Data

| Entity | Details |
|--------|---------|
| Users | 2 (admin + citizen with BCrypt passwords) |
| Vehicles | 3 (VW Golf, BMW 3 Series, Audi A4) |
| Zones | 5 Dortmund locations (Stadtgarten, Westenhellweg, Signal Iduna Park, Thier-Galerie, Phoenixsee) |
| Spaces | 24 total (mix of AVAILABLE, OCCUPIED, RESERVED, OUT_OF_SERVICE) |
| Reservations | 1 active (citizen, Westenhellweg) |
| Sessions | 1 completed + 1 active |
| Invoices | 1 pending (5.00 EUR, Stadtgarten Parkhaus) |

## Architecture Decisions

- **Spring Modulith** — modular monolith with enforced module boundaries via `@ApplicationModule`
- **Domain events** — `SessionCompleted` event auto-triggers invoice creation in billing module
- **Zone as sole authority** — only the zone module can change space status (AVAILABLE/OCCUPIED/RESERVED)
- **JWT stateless auth** — simple Bearer token, no server-side sessions
- **Vite proxy** — frontend dev server proxies `/api` to backend, eliminating CORS in development
