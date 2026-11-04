import * as SecureStore from 'expo-secure-store';

import { clearAuthData, getRefreshToken, setTokens } from '@/lib/mmkv/storage-helpers';

describe('storage-helpers', () => {
  it('keeps the new refresh token when a login happens while the logout delete is pending', async () => {
    setTokens('old-access', 'old-refresh');

    clearAuthData();
    setTokens('new-access', 'new-refresh');

    // let the pending async delete settle
    await Promise.resolve();
    await new Promise((resolve) => setImmediate(resolve));

    expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    expect(getRefreshToken()).toBe('new-refresh');
  });

  it('removes the refresh token on logout when nothing is written afterwards', async () => {
    setTokens('access', 'refresh');

    clearAuthData();
    await new Promise((resolve) => setImmediate(resolve));

    expect(getRefreshToken()).toBeNull();
  });
});
