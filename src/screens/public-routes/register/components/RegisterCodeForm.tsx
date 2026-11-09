import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { formatResendLabel } from '@/lib/resend-countdown';
import type { RegisterCodeSchema } from '@/schemas/services/account/register-request-schema';

interface RegisterCodeFormProps {
  control: Control<RegisterCodeSchema>;
  errors: FieldErrors<RegisterCodeSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onResend: () => void;
  isResending: boolean;
  resendRemaining: number;
  resendMessage?: string | null;
  apiError?: Error | null;
}

export function RegisterCodeForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onResend,
  isResending,
  resendRemaining,
  resendMessage,
  apiError,
}: RegisterCodeFormProps) {
  return (
    <View className="gap-4">
      <Text variant="muted">Se os dados estiverem corretos, você receberá um código. Digite-o abaixo.</Text>

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}
      {resendMessage && <Text variant="muted" className="text-center text-sm">{resendMessage}</Text>}

      <View className="gap-1.5">
        <Label>Código</Label>
        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
          )}
        />
        {errors.code && <Text className="text-sm text-error">{errors.code.message}</Text>}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Criando conta...' : 'Criar conta'}</Text>
      </Button>

      <Button variant="outline" onPress={onResend} disabled={isResending || resendRemaining > 0}>
        <Text>{isResending ? 'Reenviando...' : formatResendLabel(resendRemaining)}</Text>
      </Button>
    </View>
  );
}
