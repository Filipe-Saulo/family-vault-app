import MockAdapter from 'axios-mock-adapter';
import * as SecureStore from 'expo-secure-store';

import { api } from '@/api/api';
import { useAuthStore } from '@/store/authStore';

const REFRESH = '/app/refreshtoken';
let mock: MockAdapter;

function signIn(token = 'old', refreshToken = 'refresh-1') {
  useAuthStore.getState().setAuth({ token, refreshToken, userId: 'u1' });
}

beforeEach(() => {
  mock = new MockAdapter(api);
  useAuthStore.getState().logout();
  signIn();
  jest.clearAllMocks();
});

afterEach(() => mock.restore());

describe('refresh interceptor', () => {
  it('runs a single refresh for concurrent 401s and replays every request', async () => {
    mock.onGet(/\/items\/\d/).reply((config) =>
      config.headers?.Authorization === 'Bearer new' ? [200, { ok: true }] : [401]
    );
    mock.onPost(REFRESH).reply(200, { data: { token: 'new', refreshToken: 'refresh-2' } });

    const results = await Promise.all([api.get('/items/1'), api.get('/items/2')]);

    expect(results.map((r) => r.status)).toEqual([200, 200]);
    expect(mock.history.post.filter((r) => r.url === REFRESH)).toHaveLength(1);
    expect(useAuthStore.getState().token).toBe('new');
    expect(SecureStore.getItem('auth.refreshToken')).toBe('refresh-2');
  });

  it('clears the session when the refresh answers 4xx', async () => {
    mock.onGet('/items').reply(401);
    mock.onPost(REFRESH).reply(401);

    await expect(api.get('/items')).rejects.toBeDefined();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.refreshToken');
  });

  it('keeps the session on a 5xx during refresh', async () => {
    mock.onGet('/items').reply(401);
    mock.onPost(REFRESH).reply(503);

    await expect(api.get('/items')).rejects.toBeDefined();

    expect(useAuthStore.getState().token).toBe('old');
    expect(useAuthStore.getState().refreshToken).toBe('refresh-1');
  });

  it('keeps the session on a network error during refresh', async () => {
    mock.onGet('/items').reply(401);
    mock.onPost(REFRESH).networkError();

    await expect(api.get('/items')).rejects.toBeDefined();

    expect(useAuthStore.getState().token).toBe('old');
  });

  it('only replays (no second refresh) when the request was sent with an outdated token', async () => {
    mock.onGet('/items').reply((config) => {
      if (config.headers?.Authorization === 'Bearer new') return [200, { ok: true }];
      // A refresh finished while this request was in flight.
      useAuthStore.getState().updateTokens({ token: 'new', refreshToken: 'refresh-2' });
      return [401];
    });

    const response = await api.get('/items');

    expect(response.status).toBe(200);
    expect(mock.history.post.filter((r) => r.url === REFRESH)).toHaveLength(0);
  });
});
