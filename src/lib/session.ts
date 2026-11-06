import { api } from '@/api/api';
import { authStoreHelpers } from '@/store/authStore';

// Manual logout: tell the API to end this device's session (fire-and-forget, errors
// ignored), then clear the local session. When the refresh itself fails the session
// is already dead on the server, so the interceptor calls clearAuthData directly.
export function logout() {
  const refreshToken = authStoreHelpers.getRefreshToken();
  if (refreshToken) {
    api.post('/logout', { refreshToken }).catch(() => {});
  }
  authStoreHelpers.clearAuthData();
}
