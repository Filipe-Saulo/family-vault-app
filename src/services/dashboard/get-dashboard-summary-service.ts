import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { DashboardSummary } from '@/types/entities/dashboard-summary';

export interface DashboardSummaryParams {
  startDate?: string;
  endDate?: string;
}

async function getDashboardSummary(params: DashboardSummaryParams) {
  try {
    const { data } = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDashboardSummary(params: DashboardSummaryParams) {
  return useQuery({
    queryKey: ['dashboardSummary', params],
    queryFn: () => getDashboardSummary(params),
    placeholderData: keepPreviousData,
  });
}
