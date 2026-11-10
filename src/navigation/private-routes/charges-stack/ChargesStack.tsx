import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ChargeReviewScreen } from '@/screens/private-routes/charges/screens/ChargeReviewScreen';
import { ChargesScreen } from '@/screens/private-routes/charges/screens/ChargesScreen';

import type { ChargesStackRoutes } from './chargesRoutes';

const Stack = createNativeStackNavigator<ChargesStackRoutes>();

export function ChargesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="charges" component={ChargesScreen} />
      <Stack.Screen name="chargeReview" component={ChargeReviewScreen} />
    </Stack.Navigator>
  );
}
