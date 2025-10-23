import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, isLoggedIn } from '../lib/api/auth.api';
import { AuthContext, type AuthContextType, type LoginCredentials, type User } from './context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isLoggedIn());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const userData = await apiLogin(credentials);
    setIsAuthenticated(true);
    setUser((userData as User) ?? null);
    return userData as User;
  };

  const logout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
