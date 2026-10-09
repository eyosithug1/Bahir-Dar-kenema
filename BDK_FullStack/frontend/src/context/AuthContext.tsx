import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bdk_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('bdk_token');
  });

  const login = async (email: string) => {
    try {
      const res = await api.login(email);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('bdk_user', JSON.stringify(res.user));
      localStorage.setItem('bdk_token', res.token);
    } catch {
      // Offline fallback login
      const fallbackUser: User = {
        id: 'u-fan-local',
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'fan',
        membershipId: 'BDK-FAN-2026',
        createdAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      setToken('bdk_local_token');
      localStorage.setItem('bdk_user', JSON.stringify(fallbackUser));
      localStorage.setItem('bdk_token', 'bdk_local_token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bdk_user');
    localStorage.removeItem('bdk_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
