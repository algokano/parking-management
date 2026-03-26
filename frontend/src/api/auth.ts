import apiClient from './client';
import type { AuthResponse, RegisterRequest } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function getMe(): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>('/auth/me');
  return response.data;
}
