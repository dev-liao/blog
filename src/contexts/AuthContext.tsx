'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 初始化时检查登录状态
  useEffect(() => {
    const initAuth = () => {
      const user = AuthService.getCurrentUser();
      const isAuthenticated = AuthService.isAuthenticated();
      
      setAuthState({
        user,
        isAuthenticated,
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await AuthService.login(email, password);
    
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
    
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await AuthService.register(email, password, name);
    
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
    
    return result;
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      return { success: false, error: '用户未登录' };
    }

    const result = await AuthService.updateProfile(authState.user.id, updates);
    
    if (result.success && result.user) {
      setAuthState(prev => ({
        ...prev,
        user: result.user!,
      }));
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
