import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

interface ScreenHeaderProps {
  title: string;
}

// Title of a stacked screen with a back button, for the screens that would otherwise only have the system back.
export function ScreenHeader({ title }: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="mb-4 flex-row items-center gap-2">
      {navigation.canGoBack() && (
        <Button
          variant="ghost"
          size="icon"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}>
          <Icon as={ArrowLeft} />
        </Button>
      )}
      <Text variant="h2" className="flex-1">
        {title}
      </Text>
    </View>
  );
}
