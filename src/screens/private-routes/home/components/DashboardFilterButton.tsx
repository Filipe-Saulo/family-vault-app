import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CalendarIcon, ChevronDown } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface DashboardFilterButtonProps {
  label: string;
  onPress: () => void;
}

export function DashboardFilterButton({ label, onPress }: DashboardFilterButtonProps) {
  return (
    <View className="gap-1.5">
      <Text variant="muted">Período</Text>
      <Pressable
        onPress={onPress}
        className="border-input dark:bg-input/30 bg-background flex h-10 flex-row items-center justify-between gap-2 rounded-md border px-3 py-2 shadow-sm shadow-black/5 sm:h-9">
        <View className="flex-row items-center gap-2">
          <Icon as={CalendarIcon} className="text-muted-foreground size-4" />
          <Text className="text-base">{label}</Text>
        </View>
        <Icon as={ChevronDown} className="text-muted-foreground size-4" />
      </Pressable>
    </View>
  );
}
