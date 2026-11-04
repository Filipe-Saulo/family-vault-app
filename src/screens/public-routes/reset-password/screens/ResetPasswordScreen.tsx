import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { ResetPasswordContainer } from '../containers/ResetPasswordContainer';

export function ResetPasswordScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerClassName="grow justify-center px-6" keyboardShouldPersistTaps="handled">
          <Text variant="h1" className="mb-8">
            Redefinir senha
          </Text>

          <ResetPasswordContainer />

          <Button variant="link" className="mt-4" onPress={() => navigation.navigate('login' as never)}>
            <Text>Voltar para o login</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
