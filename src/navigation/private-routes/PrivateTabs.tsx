import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CategoriesStack } from './categories-stack/CategoriesStack';
import { HomeStack } from './home-stack/HomeStack';
import type { PrivateRoutes } from './privateRoutes';
import { ProfileStack } from './profile-stack/ProfileStack';
import { TransactionsStack } from './transactions-stack/TransactionsStack';

const Tab = createBottomTabNavigator<PrivateRoutes>();

export function PrivateTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="homeStack"
        component={HomeStack}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="transactionsStack"
        component={TransactionsStack}
        options={{
          title: 'Transações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="categoriesStack"
        component={CategoriesStack}
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetags-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="profileStack"
        component={ProfileStack}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
