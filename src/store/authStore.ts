import { create } from 'zustand';

import {
  clearAuthData,
  getRefreshToken,
  getToken,
  getUserId,
  setTokens,
  setUserId,
} from '@/lib/mmkv/storage-helpers';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  isRestoring: boolean;
  setAuth: (params: { token: string; refreshToken: string; userId: string }) => void;
  updateTokens: (params: { token: string; refreshToken: string }) => void;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  userId: null,
  isRestoring: true,
  setAuth: ({ token, refreshToken, userId }) => {
    setTokens(token, refreshToken);
    setUserId(userId);
    set({ token, refreshToken, userId });
  },
  updateTokens: ({ token, refreshToken }) => {
    setTokens(token, refreshToken);
    set({ token, refreshToken });
  },
  logout: () => {
    clearAuthData();
    set({ token: null, refreshToken: null, userId: null });
  },
  restoreSession: () => {
    set({
      token: getToken(),
      refreshToken: getRefreshToken(),
      userId: getUserId(),
      isRestoring: false,
    });
  },
}));

export const authStoreHelpers = {
  getToken: () => useAuthStore.getState().token,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  updateTokens: (params: { token: string; refreshToken: string }) =>
    useAuthStore.getState().updateTokens(params),
  clearAuthData: () => useAuthStore.getState().logout(),
};
