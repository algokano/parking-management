import apiClient from './client';
import type { SessionResponse, SessionStatus, StartSessionRequest } from '../types';

export async function startSession(data: StartSessionRequest): Promise<SessionResponse> {
  const response = await apiClient.post<SessionResponse>('/sessions/start', data);
  return response.data;
}

export async function stopSession(id: string): Promise<SessionResponse> {
  const response = await apiClient.post<SessionResponse>(`/sessions/${id}/stop`);
  return response.data;
}

export async function getSession(id: string): Promise<SessionResponse> {
  const response = await apiClient.get<SessionResponse>(`/sessions/${id}`);
  return response.data;
}

export async function listSessions(userId: string, status?: SessionStatus): Promise<SessionResponse[]> {
  const params: Record<string, string> = { userId };
  if (status) {
    params.status = status;
  }
  const response = await apiClient.get<SessionResponse[]>('/sessions', { params });
  return response.data;
}
