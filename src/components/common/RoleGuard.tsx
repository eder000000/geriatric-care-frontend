import type { ReactNode } from 'react';
import type { UserRole } from '@/types/auth';
import { useRole } from '@/context/useRole';

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole } = useRole();
  return hasRole(roles) ? <>{children}</> : <>{fallback}</>;
}
