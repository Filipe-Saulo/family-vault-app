import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens/private-routes/home/screens/HomeScreen';

import type { HomeStackRoutes } from './homeRoutes';

const Stack = createNativeStackNavigator<HomeStackRoutes>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
