import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { ChangePasswordContainer } from '../containers/ChangePasswordContainer';

export function ChangePasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <Text variant="h2" className="mb-4">
        Trocar senha
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ChangePasswordContainer />
      </ScrollView>
    </SafeAreaView>
  );
}
