import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';

import { ChangePasswordContainer } from '../containers/ChangePasswordContainer';

export function ChangePasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <ScreenHeader title="Trocar senha" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <ChangePasswordContainer />
      </ScrollView>
    </SafeAreaView>
  );
}
