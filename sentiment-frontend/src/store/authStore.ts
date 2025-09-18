import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '../types/api';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      },
      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);