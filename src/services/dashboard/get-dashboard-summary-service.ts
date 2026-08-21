import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import type { ApiResponse } from '@/types/entities/api-response';
import type { DashboardSummary } from '@/types/entities/dashboard-summary';

export interface DashboardSummaryParams {
  startDate?: string;
  endDate?: string;
}

async function getDashboardSummary(params: DashboardSummaryParams) {
  const { data } = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
  return data.data;
}

export function useDashboardSummary(params: DashboardSummaryParams) {
  return useQuery({
    queryKey: ['dashboardSummary', params],
    queryFn: () => getDashboardSummary(params),
  });
}
