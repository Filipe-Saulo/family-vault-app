import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { authStoreHelpers } from '@/store/authStore';
import type { ApiResponse } from '@/types/entities/api-response';

// Endpoints an expired/invalid access token can hit directly - never trigger
// the refresh flow for these, or a failed login would loop into a refresh attempt.
const PUBLIC_ROUTES = ['/register', '/app/login', '/app/refreshtoken', '/resetPassword'];

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: 'http://localhost:5090/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = authStoreHelpers.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';
    const isPublicRoute = PUBLIC_ROUTES.some((route) => requestUrl.includes(route));

    if (!originalRequest || error.response?.status !== 401 || isPublicRoute || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const expiredToken = authStoreHelpers.getToken();
      const refreshToken = authStoreHelpers.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado.');
      }

      // AccountController reads the (expired) access token from the Authorization
      // header and the refresh token from the body - see app/refreshtoken.
      const { data } = await api.post<ApiResponse<{ token: string; refreshToken: string }>>(
        '/app/refreshtoken',
        { refreshToken },
        { headers: { Authorization: `Bearer ${expiredToken}` } }
      );

      authStoreHelpers.updateTokens(data.data);
      processQueue(null, data.data.token);

      originalRequest.headers.Authorization = `Bearer ${data.data.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authStoreHelpers.clearAuthData();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
