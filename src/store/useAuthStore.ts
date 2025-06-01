// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // This would be replaced with an actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const user = await response.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          // This would be replaced with an actual API call
          await fetch('/api/auth/logout', { method: 'POST' });
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
        }
      },
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // This would be replaced with an actual API call
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });
          
          if (!response.ok) {
            throw new Error('Signup failed');
          }
          
          const user = await response.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
