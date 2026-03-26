import apiClient from './client';
import type { ReservationResponse, CreateReservationRequest } from '../types';

export async function createReservation(data: CreateReservationRequest): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>('/reservations', data);
  return response.data;
}

export async function listReservations(userId: string): Promise<ReservationResponse[]> {
  const response = await apiClient.get<ReservationResponse[]>('/reservations', {
    params: { userId },
  });
  return response.data;
}

export async function getReservation(id: string): Promise<ReservationResponse> {
  const response = await apiClient.get<ReservationResponse>(`/reservations/${id}`);
  return response.data;
}

export async function cancelReservation(id: string): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/cancel`);
  return response.data;
}
