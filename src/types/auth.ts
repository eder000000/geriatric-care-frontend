export type UserRole = 'ADMIN' | 'PHYSICIAN' | 'CAREGIVER' | 'FAMILY';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
