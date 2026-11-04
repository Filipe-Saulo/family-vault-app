import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const roles = useAuthStore((state) => state.roles);
  const permissions = useAuthStore((state) => state.permissions);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategories({ pageSize: PAGE_SIZE });
  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteCategory();

  const categories = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const canManageGlobal = hasRole(roles, 'Administrator') || hasPermission(permissions, 'ManageCategories');
  const canModify = useCallback(
    (category: Category) => canManageGlobal || !category.isGlobal,
    [canManageGlobal]
  );

  const handleEdit = useCallback(
    (category: Category) => {
      navigation.navigate('categoryForm', { category });
    },
    [navigation]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.categoryId, {
      onSuccess: () => {
        setCategoryToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      },
    });
  };

  // A failed refetch/next page keeps the loaded pages; only a failed first load blocks the list.
  const hasData = !!data;

  return (
    <>
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        errorMessage={isError && !hasData ? error.message : null}
        onRetry={() => refetch()}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        isFetchingNextPage={isFetchingNextPage}
        nextPageErrorMessage={isError && hasData ? error.message : null}
        onRetryNextPage={() => fetchNextPage()}
        canModify={canModify}
        onEdit={handleEdit}
        onDelete={setCategoryToDelete}
      />
      <ConfirmDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${categoryToDelete?.description ?? ''}"? Essa ação não pode ser desfeita.`}
        isConfirming={isDeleting}
        errorMessage={deleteError?.message}
        onOpen={resetDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}
