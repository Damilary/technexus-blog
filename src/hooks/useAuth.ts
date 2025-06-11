'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useAuth() {
  const { user, isLoading, error, login, logout, signup } = useAuthStore();

  // This is a placeholder for any additional auth logic that might be needed
  useEffect(() => {
    // Example: Check token expiration, refresh token, etc.
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };
}
