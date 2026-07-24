import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, passwordString: string) => Promise<any>;
  register: (fullName: string, email: string, passwordString: string, tariff: 'FREE' | 'PLUS' | 'PRO' | 'MAX', role?: 'client' | 'mediator') => Promise<any>;
  logout: () => void;
  updateUserTariff: (tariff: 'FREE' | 'PLUS' | 'PRO' | 'MAX') => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem('mizan_token');
      if (token) {
        try {
          const { user: fetchedUser } = await api.getMe();
          setUser(fetchedUser);
        } catch {
          localStorage.removeItem('mizan_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    syncUser();
  }, []);

  const login = async (email: string, passwordString: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await api.login({ email, password: passwordString });
      localStorage.setItem('mizan_token', token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const register = async (fullName: string, email: string, passwordString: string, tariff: 'FREE' | 'PLUS' | 'PRO' | 'MAX', role?: 'client' | 'mediator') => {
    setLoading(true);
    try {
      const { user: registeredUser, token } = await api.register({ fullName, email, password: passwordString, tariff, role });
      localStorage.setItem('mizan_token', token);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('mizan_token');
    setUser(null);
  };

  const updateUserTariff = async (tariff: 'FREE' | 'PLUS' | 'PRO' | 'MAX') => {
    if (user && tariff !== 'FREE') {
      try {
        const { user: updated } = await api.updateTariff(tariff);
        setUser(updated);
      } catch (err) {
        console.error("Serverda tarifni yangilashda xatolik:", err);
        const updatedUser = { ...user, tariff };
        setUser(updatedUser);
      }
    } else if (user) {
      const updatedUser = { ...user, tariff };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserTariff }}>
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
