import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';
import { PaginationFooter } from '@/components/PaginationFooter';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import type { Category } from '@/types/entities/category';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  canModify: boolean;
  isDeleting: boolean;
  deletingId?: number;
  deleteErrorMessage?: string;
  onDeleteDialogOpen?: () => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function CategoryList({
  categories,
  isLoading,
  errorMessage,
  onRetry,
  canModify,
  isDeleting,
  deletingId,
  deleteErrorMessage,
  onDeleteDialogOpen,
  onEdit,
  onDelete,
  pageNumber,
  totalPages,
  onPrevPage,
  onNextPage,
}: CategoryListProps) {
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
    <View className="flex-1 gap-3">
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.categoryId)}
        contentContainerClassName="gap-3"
        ListEmptyComponent={
          <Text variant="muted" className="mt-8 text-center">
            Nenhuma categoria encontrada.
          </Text>
        }
        renderItem={({ item }) => (
          <Card>
            <CardContent className="flex-row items-center justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text className="font-medium">{item.description}</Text>
                <Text variant="muted" className="text-xs">
                  {item.purpose.name}
                </Text>
              </View>
              {canModify && (
                <View className="flex-row gap-2">
                  <Button variant="outline" size="sm" onPress={() => onEdit(item)}>
                    <Text>Editar</Text>
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="destructive" size="sm">
                        <Text>Excluir</Text>
                      </Button>
                    }
                    title="Excluir categoria"
                    description={`Tem certeza que deseja excluir "${item.description}"? Essa ação não pode ser desfeita.`}
                    isConfirming={isDeleting && deletingId === item.categoryId}
                    errorMessage={deletingId === item.categoryId ? deleteErrorMessage : null}
                    onOpen={onDeleteDialogOpen}
                    onConfirm={() => onDelete(item.categoryId)}
                  />
                </View>
              )}
            </CardContent>
          </Card>
        )}
      />

      <PaginationFooter
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </View>
  );
}
