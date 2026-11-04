import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '@/screens/public-routes/forgot-password/screens/ForgotPasswordScreen';
import { LoginScreen } from '@/screens/public-routes/login/screens/LoginScreen';
import { RegisterScreen } from '@/screens/public-routes/register/screens/RegisterScreen';
import { ResetPasswordScreen } from '@/screens/public-routes/reset-password/screens/ResetPasswordScreen';

import type { PublicRoutes } from './publicRoutes';

const Stack = createNativeStackNavigator<PublicRoutes>();

export function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
