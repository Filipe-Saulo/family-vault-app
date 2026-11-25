import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Charge } from '@/types/entities/charge';

export async function getCharge(chargeId: number) {
  try {
    const { data } = await api.get<ApiResponse<Charge>>(`/charge/${chargeId}`);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCharge(chargeId: number | null | undefined) {
  return useQuery({
    queryKey: ['charges', 'detail', chargeId],
    queryFn: () => getCharge(chargeId as number),
    enabled: chargeId != null,
  });
}
