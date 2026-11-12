import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ChangePasswordScreen } from '@/screens/private-routes/profile/screens/ChangePasswordScreen';
import { McpTokensScreen } from '@/screens/private-routes/profile/screens/McpTokensScreen';
import { ProfileEditScreen } from '@/screens/private-routes/profile/screens/ProfileEditScreen';
import { ProfileScreen } from '@/screens/private-routes/profile/screens/ProfileScreen';

import type { ProfileStackRoutes } from './profileRoutes';

const Stack = createNativeStackNavigator<ProfileStackRoutes>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="profileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="changePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="mcpTokens" component={McpTokensScreen} />
    </Stack.Navigator>
  );
}
