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

// The SecureStore delete is async. If a login writes a new refresh token while a
// logout's delete is still pending, the delete would erase the new token; these
// two values let the delete restore it when it finishes.
let authGeneration = 0;
let lastRefreshToken: string | null = null;

export function setTokens(token: string, refreshToken: string): void {
  authGeneration += 1;
  lastRefreshToken = refreshToken;
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
  authGeneration += 1;
  lastRefreshToken = null;
  const generation = authGeneration;
  SecureStore.deleteItemAsync(StorageKeys.REFRESH_TOKEN)
    .then(() => {
      // A login happened while the delete was pending: put its token back.
      if (generation !== authGeneration && lastRefreshToken) {
        SecureStore.setItem(StorageKeys.REFRESH_TOKEN, lastRefreshToken);
      }
    })
    .catch(() => {});
}
