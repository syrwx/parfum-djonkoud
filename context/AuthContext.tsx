import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Mock authentication
    if (email === 'admin@djonkoud.ml' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin Principal',
        email: email,
        role: 'admin'
      });
      toast.success('Bienvenue, Administrateur');
      return true;
    }
    toast.error('Identifiants incorrects');
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};