import apiClient from './client';
import type { AuthResponse, LoginRequest } from '@/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('ghcs-token');
    localStorage.removeItem('ghcs-user');
  },
};
