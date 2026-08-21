import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export function TransactionsScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
      <Text variant="h2">Transações</Text>
      <Text variant="muted" className="mt-2 text-center">
        Lista de transações (GET /api/transaction) vai aparecer aqui.
      </Text>
    </SafeAreaView>
  );
}
