import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { RegisterContainer } from '../containers/RegisterContainer';

export function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Text variant="h1" className="mb-8">
          Criar conta
        </Text>

        <RegisterContainer />

        <Button variant="link" className="mt-4" onPress={() => navigation.navigate('login' as never)}>
          <Text>Voltar para o login</Text>
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
