import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { RegisterCodeContainer } from '../containers/RegisterCodeContainer';

export function RegisterCodeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Text variant="h1" className="mb-8">
          Confirmar cadastro
        </Text>

        <RegisterCodeContainer />

        <Button variant="link" className="mt-4" onPress={() => navigation.goBack()}>
          <Text>Corrigir meus dados</Text>
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
