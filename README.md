# Digital Parking Management System

A full-stack monorepo for managing parking zones, reservations, sessions, and billing in Dortmund.

## Architecture

- **Backend**: Spring Boot 4.0.4 + Spring Modulith + PostgreSQL + Flyway
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Router

## Project Structure

```
├── backend/          Spring Boot modulith backend
│   ├── src/main/java/com/dortmund/digital_parking_management/
│   │   ├── auth/         JWT authentication
│   │   ├── billing/      Invoices & payments
│   │   ├── reservation/  Parking reservations
│   │   ├── session/      Parking sessions
│   │   ├── shared/       Global error handling
│   │   ├── user/         Users & vehicles
│   │   └── zone/         Zones & spaces
│   └── src/main/resources/db/migration/   Flyway migrations
├── frontend/         React SPA
│   └── src/
│       ├── api/          Axios API client
│       ├── context/      Auth context
│       ├── components/   Layout, guards, UI
│       └── pages/        Citizen & admin pages
└── docker-compose.yml    PostgreSQL
```

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on http://localhost:8080. Flyway auto-creates tables and seeds demo data.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 with API proxy to backend.

## Demo Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@parking.local    | admin123    |
| Citizen | citizen@parking.local  | citizen123  |

## Seeded Data

- 5 Dortmund parking zones (Stadtgarten, Westenhellweg, Signal Iduna Park, Thier-Galerie, Phoenixsee)
- 24 parking spaces with mixed statuses
- 2 users with vehicles
- Pre-seeded reservations, sessions, and invoices
