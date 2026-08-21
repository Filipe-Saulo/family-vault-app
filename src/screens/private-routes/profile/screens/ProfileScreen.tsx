import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/authStore';

export function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text variant="h2">Perfil</Text>
      <Button onPress={logout}>
        <Text>Sair</Text>
      </Button>
    </SafeAreaView>
  );
}
