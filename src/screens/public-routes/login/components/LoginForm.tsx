import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import type { LoginRequestSchema } from '@/schemas/services/account/login-request-schema';

interface LoginFormProps {
  control: Control<LoginRequestSchema>;
  errors: FieldErrors<LoginRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  apiError?: Error | null;
}

export function LoginForm({ control, errors, isSubmitting, onSubmit, apiError }: LoginFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>E-mail</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              placeholder="voce@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && <Text className="text-sm text-error">{errors.email.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Senha</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.password && <Text className="text-sm text-error">{errors.password.message}</Text>}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
      </Button>
    </View>
  );
}
