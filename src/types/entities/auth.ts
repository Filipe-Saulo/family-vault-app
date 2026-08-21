export interface AuthResponse {
  userId: string;
  token: string;
  refreshToken: string | null;
}
