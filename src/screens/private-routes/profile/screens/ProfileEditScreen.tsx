import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { ProfileEditContainer } from '../containers/ProfileEditContainer';

export function ProfileEditScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <Text variant="h2" className="mb-4">
        Editar perfil
      </Text>
      <ProfileEditContainer />
    </SafeAreaView>
  );
}
