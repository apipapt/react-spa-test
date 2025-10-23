import { createContext } from 'react';

export type LoginCredentials = {
  phone: string;
  password: string;
};
export type User = Record<string, unknown> | null;

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
