import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { TransactionsStackRoutes } from '@/navigation/private-routes/transactions-stack/transactionsRoutes';

import { TransactionsListContainer } from '../containers/TransactionsListContainer';

export function TransactionsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TransactionsStackRoutes>>();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text variant="h2">Transações</Text>
        <Button size="sm" onPress={() => navigation.navigate('transactionForm', undefined)}>
          <Text>Nova transação</Text>
        </Button>
      </View>
      <TransactionsListContainer />
    </SafeAreaView>
  );
}
