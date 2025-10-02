'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'agency' | 'consumer' | null;

interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  businessName?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, userType: UserType, additionalData?: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session (only on client side)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('credit-hardar-user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('credit-hardar-user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on type
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        type: userType,
        businessName: userType === 'agency' ? 'Credit Repair Agency' : undefined,
        isAuthenticated: true
      };

      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('credit-hardar-user', JSON.stringify(mockUser));
      }
      
      // Redirect based on user type
      if (userType === 'agency') {
        window.location.href = '/dashboard/';
      } else {
        window.location.href = '/consumer/dashboard/';
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userType: UserType, additionalData?: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: '1',
        email,
        name: additionalData?.firstName ? `${additionalData.firstName} ${additionalData.lastName}` : email.split('@')[0],
        type: userType,
        businessName: additionalData?.companyName,
        isAuthenticated: true
      };

      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('credit-hardar-user', JSON.stringify(newUser));
      }
      
      // Redirect based on user type
      if (userType === 'agency') {
        window.location.href = '/dashboard/';
      } else {
        window.location.href = '/consumer/dashboard/';
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('credit-hardar-user');
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}