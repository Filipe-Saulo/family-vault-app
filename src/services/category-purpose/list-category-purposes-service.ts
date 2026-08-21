import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import type { ApiResponse } from '@/types/entities/api-response';
import type { CategoryPurpose } from '@/types/entities/category-purpose';

async function listCategoryPurposes(isActive?: boolean) {
  const { data } = await api.get<ApiResponse<CategoryPurpose[]>>('/categorypurpose', {
    params: { isActive },
  });
  return data.data;
}

export function useCategoryPurposes(isActive?: boolean) {
  return useQuery({
    queryKey: ['categoryPurposes', isActive],
    queryFn: () => listCategoryPurposes(isActive),
  });
}
