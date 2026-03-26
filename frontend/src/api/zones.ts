import apiClient from './client';
import type { ZoneResponse, OccupancyResponse, CreateZoneRequest, UpdateZoneRequest } from '../types';

export async function listZones(): Promise<ZoneResponse[]> {
  const response = await apiClient.get<ZoneResponse[]>('/zones');
  return response.data;
}

export async function getZone(id: string): Promise<ZoneResponse> {
  const response = await apiClient.get<ZoneResponse>(`/zones/${id}`);
  return response.data;
}

export async function createZone(data: CreateZoneRequest): Promise<ZoneResponse> {
  const response = await apiClient.post<ZoneResponse>('/zones', data);
  return response.data;
}

export async function updateZone(id: string, data: UpdateZoneRequest): Promise<ZoneResponse> {
  const response = await apiClient.put<ZoneResponse>(`/zones/${id}`, data);
  return response.data;
}

export async function getOccupancy(id: string): Promise<OccupancyResponse> {
  const response = await apiClient.get<OccupancyResponse>(`/zones/${id}/occupancy`);
  return response.data;
}
