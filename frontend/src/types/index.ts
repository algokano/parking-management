// Enums matching backend exactly
export type ZoneType = 'STREET' | 'GARAGE' | 'LOT';
export type SpaceStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
export type ReservationStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED';
export type SessionStatus = 'ACTIVE' | 'COMPLETED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'WALLET';
export type UserRole = 'CITIZEN' | 'ADMIN';

// Response interfaces matching backend JSON exactly

export interface AuthResponse {
  token: string | null;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ZoneResponse {
  id: string;
  name: string;
  address: string;
  zoneType: ZoneType;
  hourlyRate: number;
  totalSpaces: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface SpaceResponse {
  id: string;
  zoneId: string;
  spaceNumber: string;
  status: SpaceStatus;
  floor: number | null;
  createdAt: string;
}

export interface OccupancyResponse {
  zoneId: string;
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  outOfService: number;
}

export interface VehicleResponse {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  createdAt: string;
}

export interface ReservationResponse {
  id: string;
  userId: string;
  vehicleId: string;
  zoneId: string;
  spaceId: string;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  createdAt: string;
  cancelledAt: string | null;
}

export interface SessionResponse {
  id: string;
  userId: string;
  vehicleId: string;
  zoneId: string;
  spaceId: string;
  reservationId: string | null;
  status: SessionStatus;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  createdAt: string;
}

export interface InvoiceResponse {
  id: string;
  sessionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  durationMinutes: number;
  hourlyRate: number;
  zoneName: string;
  issuedAt: string;
  paidAt: string | null;
}

export interface PaymentResponse {
  id: string;
  invoiceId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  successful: boolean;
  failureReason: string | null;
  processedAt: string;
}

// Request interfaces

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface CreateReservationRequest {
  userId: string;
  vehicleId: string;
  zoneId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
}

export interface StartSessionRequest {
  userId: string;
  vehicleId: string;
  zoneId: string;
  spaceId: string;
  reservationId?: string;
}

export interface PayInvoiceRequest {
  paymentMethod: PaymentMethod;
}

export interface CreateZoneRequest {
  name: string;
  address: string;
  zoneType: ZoneType;
  hourlyRate: number;
  latitude?: number;
  longitude?: number;
}

export interface UpdateZoneRequest {
  name: string;
  address: string;
  zoneType: ZoneType;
  hourlyRate: number;
  latitude?: number;
  longitude?: number;
}

export interface CreateSpaceRequest {
  spaceNumber: string;
  floor?: number;
}

export interface UpdateSpaceStatusRequest {
  status: SpaceStatus;
}
