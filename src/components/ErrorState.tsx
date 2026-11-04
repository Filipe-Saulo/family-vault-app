import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="items-center gap-3 py-8">
      <Text className="text-center text-sm text-error">{message}</Text>
      <Button variant="outline" size="sm" onPress={onRetry}>
        <Text>Tentar de novo</Text>
      </Button>
    </View>
  );
}
