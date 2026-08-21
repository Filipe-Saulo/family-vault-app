import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import type { CategoriesStackRoutes } from '@/navigation/private-routes/categories-stack/categoriesRoutes';

import { CategoryFormContainer } from '../containers/CategoryFormContainer';

export function CategoryFormScreen() {
  const route = useRoute<RouteProp<CategoriesStackRoutes, 'categoryForm'>>();
  const category = route.params?.category;

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <Text variant="h2" className="mb-4">
        {category ? 'Editar categoria' : 'Nova categoria'}
      </Text>
      <CategoryFormContainer category={category} />
    </SafeAreaView>
  );
}
