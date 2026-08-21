import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '@/screens/private-routes/profile/screens/ProfileScreen';

import type { ProfileStackRoutes } from './profileRoutes';

const Stack = createNativeStackNavigator<ProfileStackRoutes>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
