// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterData } from '../types';
import api from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        const storedToken = parsedUser.token;

        if (storedToken) {
          setUser(parsedUser);
          setToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          logout(); // Token missing in parsed user
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...userData } = response.data;

      const userWithToken = { ...userData, token };

      localStorage.setItem('user', JSON.stringify(userWithToken));
      setToken(token);
      setUser(userWithToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;

      const userWithToken = { ...user, token };

      localStorage.setItem('user', JSON.stringify(userWithToken));
      setToken(token);
      setUser(userWithToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
