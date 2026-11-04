import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import type { ChangePasswordRequestSchema } from '@/schemas/services/account/change-password-request-schema';

interface ChangePasswordFormProps {
  control: Control<ChangePasswordRequestSchema>;
  errors: FieldErrors<ChangePasswordRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  apiError?: Error | null;
}

export function ChangePasswordForm({ control, errors, isSubmitting, onSubmit, apiError }: ChangePasswordFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>Senha atual</Label>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.currentPassword && <Text className="text-sm text-error">{errors.currentPassword.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Nova senha</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.password && <Text className="text-sm text-error">{errors.password.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Confirmar nova senha</Label>
        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.passwordConfirm && (
          <Text className="text-sm text-error">{errors.passwordConfirm.message}</Text>
        )}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Salvando...' : 'Trocar senha'}</Text>
      </Button>
    </View>
  );
}
