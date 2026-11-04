import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Category } from '@/types/entities/category';

interface CategoryRowProps {
  category: Category;
  canModify: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryRow = memo(function CategoryRow({ category, canModify, onEdit, onDelete }: CategoryRowProps) {
  return (
    <Card>
      <CardContent className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-medium">{category.description}</Text>
            {category.isGlobal && (
              <View className="rounded-full bg-secondary px-2 py-0.5">
                <Text className="text-xs text-secondary-foreground">Global</Text>
              </View>
            )}
          </View>
          <Text variant="muted" className="text-xs">
            {category.purpose.name}
          </Text>
        </View>
        {canModify && (
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              accessibilityRole="button"
              accessibilityLabel={`Editar categoria ${category.description}`}
              onPress={() => onEdit(category)}>
              <Text>Editar</Text>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              accessibilityRole="button"
              accessibilityLabel={`Excluir categoria ${category.description}`}
              onPress={() => onDelete(category)}>
              <Text>Excluir</Text>
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
});

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  nextPageErrorMessage: string | null;
  onRetryNextPage: () => void;
  canModify: (category: Category) => boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const keyExtractor = (item: Category) => String(item.categoryId);

export function CategoryList({
  categories,
  isLoading,
  errorMessage,
  onRetry,
  isRefreshing,
  onRefresh,
  onEndReached,
  isFetchingNextPage,
  nextPageErrorMessage,
  onRetryNextPage,
  canModify,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryRow category={item} canModify={canModify(item)} onEdit={onEdit} onDelete={onDelete} />
    ),
    [canModify, onEdit, onDelete]
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator />
      </View>
    );
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="gap-3"
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text variant="muted" className="mt-8 text-center">
          Nenhuma categoria encontrada.
        </Text>
      }
      ListFooterComponent={
        nextPageErrorMessage ? (
          <ErrorState message={nextPageErrorMessage} onRetry={onRetryNextPage} />
        ) : isFetchingNextPage ? (
          <View className="items-center py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}
