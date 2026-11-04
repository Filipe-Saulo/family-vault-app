import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { hasPermission, hasRole } from '@/lib/permissions';
import type { CategoriesStackRoutes } from '@/navigation/private-routes/categories-stack/categoriesRoutes';
import { useCategories } from '@/services/category/list-categories-service';
import { useDeleteCategory } from '@/services/category/delete-category-service';
import { useAuthStore } from '@/store/authStore';
import type { Category } from '@/types/entities/category';

import { CategoryList } from '../components/CategoryList';

const PAGE_SIZE = 20;

export function CategoriesListContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<CategoriesStackRoutes>>();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const roles = useAuthStore((state) => state.roles);
  const permissions = useAuthStore((state) => state.permissions);

  const { data, isLoading, isError, error, refetch } = useCategories({ pageNumber, pageSize: PAGE_SIZE });
  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    variables: deletingId,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteCategory();

  const canManageGlobal = hasRole(roles, 'Administrator') || hasPermission(permissions, 'ManageCategories');
  const canModify = (category: Category) => canManageGlobal || !category.isGlobal;
  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  const handleEdit = (category: Category) => {
    navigation.navigate('categoryForm', { category });
  };

  const handleDelete = (categoryId: number) => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      },
    });
  };

  return (
    <CategoryList
      categories={data?.items ?? []}
      isLoading={isLoading}
      errorMessage={isError ? error.message : null}
      onRetry={() => refetch()}
      canModify={canModify}
      isDeleting={isDeleting}
      deletingId={deletingId}
      deleteErrorMessage={deleteError?.message}
      onDeleteDialogOpen={resetDelete}
      onEdit={handleEdit}
      onDelete={handleDelete}
      pageNumber={pageNumber}
      totalPages={totalPages}
      onPrevPage={() => setPageNumber((page) => Math.max(1, page - 1))}
      onNextPage={() => setPageNumber((page) => Math.min(totalPages, page + 1))}
    />
  );
}
