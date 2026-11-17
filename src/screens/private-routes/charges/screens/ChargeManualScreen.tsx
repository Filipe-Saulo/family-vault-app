import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import type { ChargesStackRoutes } from '@/navigation/private-routes/charges-stack/chargesRoutes';

import { ChargeManualContainer } from '../containers/ChargeManualContainer';

export function ChargeManualScreen() {
  const route = useRoute<RouteProp<ChargesStackRoutes, 'chargeManual'>>();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <Text variant="h2" className="mb-4">
        Informar valor
      </Text>
      <ChargeManualContainer failure={route.params.failure} />
    </SafeAreaView>
  );
}
