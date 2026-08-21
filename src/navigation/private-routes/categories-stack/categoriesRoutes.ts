import type { Category } from '@/types/entities/category';

export type CategoriesStackRoutes = {
  categories: undefined;
  categoryForm: { category?: Category } | undefined;
};
