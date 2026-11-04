import * as SecureStore from 'expo-secure-store';

import { secureStorage } from '@/lib/mmkv/mmkv-instance';
import { StorageKeys } from '@/lib/mmkv/storage-helpers';
import { queryClient } from '@/lib/react-query/react-query-client';
import { logout } from '@/lib/session';
import { useAuthStore } from '@/store/authStore';

jest.mock('@/api/api', () => ({ api: { post: jest.fn(() => Promise.resolve()) } }));

beforeEach(() => {
  useAuthStore.getState().logout();
  jest.clearAllMocks();
});

describe('auth session storage', () => {
  it('keeps the refresh token in the SecureStore, not in MMKV', () => {
    useAuthStore.getState().setAuth({ token: 't', refreshToken: 'r', userId: 'u' });

    expect(SecureStore.getItem(StorageKeys.REFRESH_TOKEN)).toBe('r');
    expect(secureStorage.getString(StorageKeys.REFRESH_TOKEN)).toBeUndefined();
    expect(secureStorage.getString(StorageKeys.TOKEN)).toBe('t');
  });

  it('restores the session from MMKV and SecureStore', () => {
    useAuthStore.getState().setAuth({ token: 't', refreshToken: 'r', userId: 'u' });
    useAuthStore.setState({ token: null, refreshToken: null, userId: null });

    useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect([state.token, state.refreshToken, state.userId]).toEqual(['t', 'r', 'u']);
    expect(state.isRestoring).toBe(false);
  });

  it('migrates a legacy MMKV refresh token to the SecureStore on restore', () => {
    secureStorage.set(StorageKeys.TOKEN, 't');
    secureStorage.set(StorageKeys.REFRESH_TOKEN, 'legacy');

    useAuthStore.getState().restoreSession();

    expect(SecureStore.getItem(StorageKeys.REFRESH_TOKEN)).toBe('legacy');
    expect(secureStorage.getString(StorageKeys.REFRESH_TOKEN)).toBeUndefined();
    expect(useAuthStore.getState().refreshToken).toBe('legacy');
  });

  it('logout clears MMKV, the SecureStore and the query cache', async () => {
    useAuthStore.getState().setAuth({ token: 't', refreshToken: 'r', userId: 'u' });
    queryClient.setQueryData(['x'], { a: 1 });

    logout();
    await Promise.resolve();

    expect(secureStorage.getString(StorageKeys.TOKEN)).toBeUndefined();
    expect(secureStorage.getString(StorageKeys.USER_ID)).toBeUndefined();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(StorageKeys.REFRESH_TOKEN);
    expect(SecureStore.getItem(StorageKeys.REFRESH_TOKEN)).toBeNull();
    expect(queryClient.getQueryData(['x'])).toBeUndefined();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
