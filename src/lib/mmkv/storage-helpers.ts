import * as SecureStore from 'expo-secure-store';

import { secureStorage } from '@/lib/mmkv/mmkv-instance';

export const StorageKeys = {
  TOKEN: 'auth.token',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER_ID: 'auth.userId',
} as const;

// The refresh token is long-lived, so it lives in the OS keychain/keystore
// (expo-secure-store). The MMKV instance is not encrypted and only keeps the
// short-lived access token and the user id.

export function getToken(): string | null {
  return secureStorage.getString(StorageKeys.TOKEN) ?? null;
}

export function getRefreshToken(): string | null {
  return SecureStore.getItem(StorageKeys.REFRESH_TOKEN);
}

export function getUserId(): string | null {
  return secureStorage.getString(StorageKeys.USER_ID) ?? null;
}

export function setTokens(token: string, refreshToken: string): void {
  secureStorage.set(StorageKeys.TOKEN, token);
  SecureStore.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);
}

export function setUserId(userId: string): void {
  secureStorage.set(StorageKeys.USER_ID, userId);
}

// One-time migration: older versions kept the refresh token in MMKV. Move it to
// the SecureStore and erase it from MMKV. Never overwrites a token already in the keychain.
export function migrateRefreshTokenToSecureStore(): void {
  const legacy = secureStorage.getString(StorageKeys.REFRESH_TOKEN);
  if (legacy === undefined) return;
  if (!SecureStore.getItem(StorageKeys.REFRESH_TOKEN)) {
    SecureStore.setItem(StorageKeys.REFRESH_TOKEN, legacy);
  }
  secureStorage.remove(StorageKeys.REFRESH_TOKEN);
}

export function clearAuthData(): void {
  secureStorage.remove(StorageKeys.TOKEN);
  secureStorage.remove(StorageKeys.REFRESH_TOKEN);
  secureStorage.remove(StorageKeys.USER_ID);
  // The SecureStore only has an async delete; the in-memory state is cleared
  // synchronously by the store, so the session is already gone for the UI.
  SecureStore.deleteItemAsync(StorageKeys.REFRESH_TOKEN).catch(() => {});
}
