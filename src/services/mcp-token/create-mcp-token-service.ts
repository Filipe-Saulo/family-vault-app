import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { CreateMcpTokenRequestSchema } from '@/schemas/services/mcp-token/create-mcp-token-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { McpTokenCreated } from '@/types/entities/mcp-token';

// 409 (already 5 active tokens) and 400 come with a Portuguese message from the API, which toAppError keeps.
async function createMcpToken(payload: CreateMcpTokenRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<McpTokenCreated>>('/user/me/mcp-tokens', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCreateMcpToken() {
  return useMutation({
    mutationFn: createMcpToken,
    // The response carries the token value: keep it out of the MutationCache once the screen has read it.
    gcTime: 0,
  });
}
