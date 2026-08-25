import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

interface DashboardMonthNavProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export function DashboardMonthNav({ label, onPrevious, onNext, isNextDisabled }: DashboardMonthNavProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Button variant="ghost" size="icon" onPress={onPrevious}>
        <Icon as={ChevronLeft} />
      </Button>
      <Text className="text-base font-medium">{label}</Text>
      <Button variant="ghost" size="icon" onPress={onNext} disabled={isNextDisabled}>
        <Icon as={ChevronRight} />
      </Button>
    </View>
  );
}
