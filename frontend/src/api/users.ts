import apiClient from './client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  createdAt: string;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export async function getUser(userId: string): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(`/users/${userId}`);
  return response.data;
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>(`/users/${userId}`, data);
  return response.data;
}
