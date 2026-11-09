import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { formatResendLabel } from '@/lib/resend-countdown';
import type { ResetPasswordRequestSchema } from '@/schemas/services/account/reset-password-request-schema';

interface ResetPasswordFormProps {
  control: Control<ResetPasswordRequestSchema>;
  errors: FieldErrors<ResetPasswordRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onResend: () => void;
  isResending: boolean;
  resendRemaining: number;
  resendMessage?: string | null;
  apiError?: Error | null;
}

export function ResetPasswordForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onResend,
  isResending,
  resendRemaining,
  resendMessage,
  apiError,
}: ResetPasswordFormProps) {
  return (
    <View className="gap-4">
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
        <Text>{isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}</Text>
      </Button>

      <Button variant="outline" onPress={onResend} disabled={isResending || resendRemaining > 0}>
        <Text>{isResending ? 'Reenviando...' : formatResendLabel(resendRemaining)}</Text>
      </Button>
    </View>
  );
}
