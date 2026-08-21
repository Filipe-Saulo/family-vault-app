export interface ApiResponse<T> {
  message: string;
  data: T;
  traceId?: string | null;
}
