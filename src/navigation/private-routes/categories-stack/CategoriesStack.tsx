import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CategoryFormScreen } from '@/screens/private-routes/categories/screens/CategoryFormScreen';
import { CategoriesScreen } from '@/screens/private-routes/categories/screens/CategoriesScreen';

import type { CategoriesStackRoutes } from './categoriesRoutes';

const Stack = createNativeStackNavigator<CategoriesStackRoutes>();

export function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="categories" component={CategoriesScreen} />
      <Stack.Screen name="categoryForm" component={CategoryFormScreen} />
    </Stack.Navigator>
  );
}
