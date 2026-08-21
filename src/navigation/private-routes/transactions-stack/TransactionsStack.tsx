import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionsScreen } from '@/screens/private-routes/transactions/screens/TransactionsScreen';

import type { TransactionsStackRoutes } from './transactionsRoutes';

const Stack = createNativeStackNavigator<TransactionsStackRoutes>();

export function TransactionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
}
