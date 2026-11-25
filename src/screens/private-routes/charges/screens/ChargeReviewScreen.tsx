import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import type { ChargesStackRoutes } from '@/navigation/private-routes/charges-stack/chargesRoutes';

import { ChargeReviewContainer } from '../containers/ChargeReviewContainer';

export function ChargeReviewScreen() {
  const route = useRoute<RouteProp<ChargesStackRoutes, 'chargeReview'>>();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <ScreenHeader title="Revisar conta" />
      <ChargeReviewContainer charge={route.params.charge} />
    </SafeAreaView>
  );
}
