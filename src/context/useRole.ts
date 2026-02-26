import { useAuth } from './AuthContext';
import type { UserRole } from '@/types/auth';

export function useRole() {
  const { user } = useAuth();
  return {
    role: user?.role ?? null,
    isAdmin: user?.role === 'ADMIN',
    isPhysician: user?.role === 'PHYSICIAN',
    isCaregiver: user?.role === 'CAREGIVER',
    isFamily: user?.role === 'FAMILY',
    hasRole: (roles: UserRole[]) => !!user && roles.includes(user.role),
  };
}
