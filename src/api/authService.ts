import apiClient from './client';
import type { AuthResponse, LoginRequest, User } from '@/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    const r = response.data;
    const user: User = {
      id: r.userId,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      role: r.role,
    };
    return { token: r.token, user };
  },
  logout: () => {
    localStorage.removeItem('ghcs-token');
    localStorage.removeItem('ghcs-user');
  },
};
