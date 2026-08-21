import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { CategoriesStackRoutes } from '@/navigation/private-routes/categories-stack/categoriesRoutes';

import { CategoriesListContainer } from '../containers/CategoriesListContainer';

export function CategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CategoriesStackRoutes>>();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text variant="h2">Categorias</Text>
        <Button size="sm" onPress={() => navigation.navigate('categoryForm', undefined)}>
          <Text>Nova categoria</Text>
        </Button>
      </View>
      <CategoriesListContainer />
    </SafeAreaView>
  );
}
