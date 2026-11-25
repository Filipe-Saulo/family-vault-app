import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { McpToken } from '@/types/entities/mcp-token';

async function listMcpTokens() {
  try {
    const { data } = await api.get<ApiResponse<McpToken[]>>('/user/me/mcp-tokens');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useMcpTokens() {
  return useQuery({
    queryKey: ['mcpTokens'],
    queryFn: listMcpTokens,
  });
}
