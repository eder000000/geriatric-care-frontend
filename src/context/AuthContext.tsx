import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ghcs-user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('ghcs-token')
  );

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('ghcs-token', newToken);
    localStorage.setItem('ghcs-user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('ghcs-token');
    localStorage.removeItem('ghcs-user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
