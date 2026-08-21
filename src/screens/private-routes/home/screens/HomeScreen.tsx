import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { DashboardContainer } from '../containers/DashboardContainer';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="gap-4 pb-4">
        <Text variant="h2">Dashboard</Text>
        <DashboardContainer />
      </ScrollView>
    </SafeAreaView>
  );
}
