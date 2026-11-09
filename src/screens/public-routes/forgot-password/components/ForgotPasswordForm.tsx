import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { ChannelToggle } from '@/components/ChannelToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneField } from '@/components/ui/phone-field';
import { Text } from '@/components/ui/text';
import type { VerificationMethod } from '@/schemas/services/account/contact-issues';
import type { ForgotPasswordRequestSchema } from '@/schemas/services/account/forgot-password-request-schema';

interface ForgotPasswordFormProps {
  control: Control<ForgotPasswordRequestSchema>;
  errors: FieldErrors<ForgotPasswordRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onMethodChange: (method: VerificationMethod) => void;
  apiError?: Error | null;
}

export function ForgotPasswordForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onMethodChange,
  apiError,
}: ForgotPasswordFormProps) {
  const method = useWatch({ control, name: 'method' });

  return (
    <View className="gap-4">
      <Text variant="muted">
        Escolha como receber o código e informe o dado cadastrado. Se os dados estiverem corretos, você receberá um
        código para redefinir a senha.
      </Text>

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <ChannelToggle method={method} onChange={onMethodChange} />

      {method === 'email' ? (
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
      ) : (
        <View className="gap-1.5">
          <Label>Telefone</Label>
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur } }) => (
              <PhoneField value={value ?? ''} onChange={onChange} onBlur={onBlur} placeholder="11987654321" />
            )}
          />
          {errors.phone && <Text className="text-sm text-error">{errors.phone.message}</Text>}
        </View>
      )}

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Enviando...' : 'Enviar código'}</Text>
      </Button>
    </View>
  );
}
