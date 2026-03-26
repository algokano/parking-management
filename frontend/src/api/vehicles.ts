import apiClient from './client';
import type { VehicleResponse } from '../types';

export async function listVehicles(userId: string): Promise<VehicleResponse[]> {
  const response = await apiClient.get<VehicleResponse[]>(`/users/${userId}/vehicles`);
  return response.data;
}

export async function addVehicle(
  userId: string,
  data: { licensePlate: string; make: string; model: string; color: string },
): Promise<VehicleResponse> {
  const response = await apiClient.post<VehicleResponse>(`/users/${userId}/vehicles`, data);
  return response.data;
}

export async function removeVehicle(userId: string, vehicleId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/vehicles/${vehicleId}`);
}
