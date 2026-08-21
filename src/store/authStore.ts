import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { PERMISSION_CLAIM, ROLE_CLAIM, toStringArray } from '@/lib/permissions';
import {
  clearAuthData,
  getRefreshToken,
  getToken,
  getUserId,
  setTokens,
  setUserId,
} from '@/lib/mmkv/storage-helpers';
import type { DecodedToken } from '@/types/entities/decoded-token';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  roles: string[];
  permissions: string[];
  isRestoring: boolean;
  setAuth: (params: { token: string; refreshToken: string; userId: string }) => void;
  updateTokens: (params: { token: string; refreshToken: string }) => void;
  logout: () => void;
  restoreSession: () => void;
}

function decodeAuthClaims(token: string): { roles: string[]; permissions: string[] } {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      roles: toStringArray(decoded[ROLE_CLAIM]),
      permissions: toStringArray(decoded[PERMISSION_CLAIM]),
    };
  } catch {
    return { roles: [], permissions: [] };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  userId: null,
  roles: [],
  permissions: [],
  isRestoring: true,
  setAuth: ({ token, refreshToken, userId }) => {
    setTokens(token, refreshToken);
    setUserId(userId);
    set({ token, refreshToken, userId, ...decodeAuthClaims(token) });
  },
  updateTokens: ({ token, refreshToken }) => {
    setTokens(token, refreshToken);
    set({ token, refreshToken, ...decodeAuthClaims(token) });
  },
  logout: () => {
    clearAuthData();
    set({ token: null, refreshToken: null, userId: null, roles: [], permissions: [] });
  },
  restoreSession: () => {
    const token = getToken();
    set({
      token,
      refreshToken: getRefreshToken(),
      userId: getUserId(),
      isRestoring: false,
      ...(token ? decodeAuthClaims(token) : { roles: [], permissions: [] }),
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
