import { secureStorage } from '@/lib/mmkv/mmkv-instance';

export const StorageKeys = {
  TOKEN: 'auth.token',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER_ID: 'auth.userId',
} as const;

export function getToken(): string | null {
  return secureStorage.getString(StorageKeys.TOKEN) ?? null;
}

export function getRefreshToken(): string | null {
  return secureStorage.getString(StorageKeys.REFRESH_TOKEN) ?? null;
}

export function getUserId(): string | null {
  return secureStorage.getString(StorageKeys.USER_ID) ?? null;
}

export function setTokens(token: string, refreshToken: string): void {
  secureStorage.set(StorageKeys.TOKEN, token);
  secureStorage.set(StorageKeys.REFRESH_TOKEN, refreshToken);
}

export function setUserId(userId: string): void {
  secureStorage.set(StorageKeys.USER_ID, userId);
}

export function clearAuthData(): void {
  secureStorage.remove(StorageKeys.TOKEN);
  secureStorage.remove(StorageKeys.REFRESH_TOKEN);
  secureStorage.remove(StorageKeys.USER_ID);
}
