import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/public-routes/login/screens/LoginScreen';
import { RegisterScreen } from '@/screens/public-routes/register/screens/RegisterScreen';

import type { PublicRoutes } from './publicRoutes';

const Stack = createNativeStackNavigator<PublicRoutes>();

export function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
