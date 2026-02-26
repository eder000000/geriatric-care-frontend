export type UserRole = 'ADMIN' | 'PHYSICIAN' | 'CAREGIVER' | 'FAMILY';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
