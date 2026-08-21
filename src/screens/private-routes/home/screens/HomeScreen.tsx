import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
      <Text variant="h2">Dashboard</Text>
      <Text variant="muted" className="mt-2 text-center">
        Resumo de receitas e despesas (GET /api/dashboard/summary) vai aparecer aqui.
      </Text>
    </SafeAreaView>
  );
}
