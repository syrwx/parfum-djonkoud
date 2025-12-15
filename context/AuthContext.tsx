
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  updateProfile: (newEmail?: string, newPassword?: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success && data.user) {
        setUser({
          id: 'admin',
          name: data.user.name,
          email: data.user.email,
          role: 'admin'
        });
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error('Identifiants incorrects');
        return false;
      }
    } catch (error) {
      console.error("Erreur login:", error);
      toast.error("Erreur de connexion au serveur");
      return false;
    }
  };

  const updateProfile = async (newEmail?: string, newPassword?: string): Promise<boolean> => {
    if (!user) return false;
    try {
        const res = await fetch('/api/auth/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentEmail: user.email,
                newEmail,
                newPassword
            })
        });
        const data = await res.json();
        if (data.success) {
            setUser(prev => prev ? { ...prev, email: data.user.email } : null);
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
