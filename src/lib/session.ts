import { api } from '@/api/api';
import { authStoreHelpers } from '@/store/authStore';

// Manual logout: tell the API to end the user's sessions (fire-and-forget, errors
// ignored), then clear the local session. When the refresh itself fails the session
// is already dead on the server, so the interceptor calls clearAuthData directly.
export function logout() {
  const token = authStoreHelpers.getToken();
  if (token) {
    api.post('/logout', { token }).catch(() => {});
  }
  authStoreHelpers.clearAuthData();
}
