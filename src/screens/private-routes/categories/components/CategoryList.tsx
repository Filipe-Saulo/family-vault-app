import { FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import type { Category } from '@/types/entities/category';

interface CategoryListProps {
  categories: Category[];
  canModify: boolean;
  isDeleting: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function CategoryList({
  categories,
  canModify,
  isDeleting,
  onEdit,
  onDelete,
  pageNumber,
  totalPages,
  onPrevPage,
  onNextPage,
}: CategoryListProps) {
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
                    isConfirming={isDeleting}
                    onConfirm={() => onDelete(item.categoryId)}
                  />
                </View>
              )}
            </CardContent>
          </Card>
        )}
      />

      {totalPages > 1 && (
        <View className="flex-row items-center justify-between">
          <Button variant="outline" size="sm" disabled={pageNumber <= 1} onPress={onPrevPage}>
            <Text>Anterior</Text>
          </Button>
          <Text variant="muted" className="text-xs">
            Página {pageNumber} de {totalPages}
          </Text>
          <Button variant="outline" size="sm" disabled={pageNumber >= totalPages} onPress={onNextPage}>
            <Text>Próxima</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
