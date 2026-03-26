import apiClient from './client';
import type { SpaceResponse, SpaceStatus, CreateSpaceRequest, UpdateSpaceStatusRequest } from '../types';

export async function listSpaces(zoneId: string, status?: SpaceStatus): Promise<SpaceResponse[]> {
  const params: Record<string, string> = {};
  if (status) {
    params.status = status;
  }
  const response = await apiClient.get<SpaceResponse[]>(`/zones/${zoneId}/spaces`, { params });
  return response.data;
}

export async function listAvailableSpaces(zoneId: string): Promise<SpaceResponse[]> {
  const response = await apiClient.get<SpaceResponse[]>(`/zones/${zoneId}/spaces/available`);
  return response.data;
}

export async function addSpace(zoneId: string, data: CreateSpaceRequest): Promise<SpaceResponse> {
  const response = await apiClient.post<SpaceResponse>(`/zones/${zoneId}/spaces`, data);
  return response.data;
}

export async function updateSpaceStatus(
  zoneId: string,
  spaceId: string,
  data: UpdateSpaceStatusRequest,
): Promise<SpaceResponse> {
  const response = await apiClient.patch<SpaceResponse>(
    `/zones/${zoneId}/spaces/${spaceId}/status`,
    data,
  );
  return response.data;
}
