import { View } from 'react-native';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppColorScheme } from '@/lib/react-native-reusables/use-app-color-scheme';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useAppColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center justify-between">
      <Label>Tema escuro</Label>
      <Switch checked={isDark} onCheckedChange={(checked) => setColorScheme(checked ? 'dark' : 'light')} />
    </View>
  );
}
