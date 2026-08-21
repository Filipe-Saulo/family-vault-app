import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import type { TransactionsStackRoutes } from '@/navigation/private-routes/transactions-stack/transactionsRoutes';

import { TransactionFormContainer } from '../containers/TransactionFormContainer';

export function TransactionFormScreen() {
  const route = useRoute<RouteProp<TransactionsStackRoutes, 'transactionForm'>>();
  const transaction = route.params?.transaction;

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <Text variant="h2" className="mb-4">
        {transaction ? 'Editar transação' : 'Nova transação'}
      </Text>
      <TransactionFormContainer transaction={transaction} />
    </SafeAreaView>
  );
}
