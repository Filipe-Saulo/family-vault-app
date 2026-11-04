import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface PaginationFooterProps {
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PaginationFooter({ pageNumber, totalPages, onPrevPage, onNextPage }: PaginationFooterProps) {
  if (totalPages <= 1) return null;

  return (
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
  );
}
