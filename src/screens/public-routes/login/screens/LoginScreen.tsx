import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { LoginContainer } from '../containers/LoginContainer';

export function LoginScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Text variant="h1" className="mb-8">
          Family Vault
        </Text>

        <LoginContainer />

        <Button variant="link" className="mt-4" onPress={() => navigation.navigate('register' as never)}>
          <Text>Não tem conta? Cadastre-se</Text>
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
