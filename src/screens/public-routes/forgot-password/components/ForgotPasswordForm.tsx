import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PhoneField } from '@/components/ui/phone-field';
import { Text } from '@/components/ui/text';
import type { ForgotPasswordRequestSchema } from '@/schemas/services/account/forgot-password-request-schema';

interface ForgotPasswordFormProps {
  control: Control<ForgotPasswordRequestSchema>;
  errors: FieldErrors<ForgotPasswordRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  apiError?: Error | null;
}

export function ForgotPasswordForm({ control, errors, isSubmitting, onSubmit, apiError }: ForgotPasswordFormProps) {
  return (
    <View className="gap-4">
      <Text variant="muted">Informe o telefone cadastrado. Enviaremos um código para redefinir a senha.</Text>

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>Telefone</Label>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur } }) => (
            <PhoneField value={value} onChange={onChange} onBlur={onBlur} placeholder="11987654321" />
          )}
        />
        {errors.phone && <Text className="text-sm text-error">{errors.phone.message}</Text>}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Enviando...' : 'Enviar código'}</Text>
      </Button>
    </View>
  );
}
