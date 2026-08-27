import axiosInstance from '@/lib/axiosInstance';
import type { LoginRequest, LoginResponse } from './auth.types';

export async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', payload);
  return response.data;
}

export function logoutRequest(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
