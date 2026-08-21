import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text variant="h2">Criar conta</Text>
      <Text variant="muted" className="text-center">
        Formulário de cadastro (POST /api/register) vai aparecer aqui.
      </Text>
      <Button variant="link" onPress={() => navigation.navigate('login' as never)}>
        <Text>Voltar para o login</Text>
      </Button>
    </SafeAreaView>
  );
}
