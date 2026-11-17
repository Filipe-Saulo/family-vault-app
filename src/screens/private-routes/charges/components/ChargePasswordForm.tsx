import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import type { ChargePasswordRequestSchema } from '@/schemas/services/charge/charge-password-request-schema';

interface ChargePasswordFormProps {
  control: Control<ChargePasswordRequestSchema>;
  errors: FieldErrors<ChargePasswordRequestSchema>;
  sender: string | null;
  attemptsLabel: string | null;
  showRemember: boolean;
  onSubmit: () => void;
  onInformAmount: () => void;
  isSubmitting: boolean;
  apiError?: Error | null;
}

export function ChargePasswordForm({
  control,
  errors,
  sender,
  attemptsLabel,
  showRemember,
  onSubmit,
  onInformAmount,
  isSubmitting,
  apiError,
}: ChargePasswordFormProps) {
  return (
    <ScrollView contentContainerClassName="gap-4 pb-8" keyboardShouldPersistTaps="handled">
      <Text variant="muted" className="text-sm">
        O PDF desta conta está protegido por senha.{sender ? ` Enviado por ${sender}.` : ''}
      </Text>
      {attemptsLabel && <Text className="text-sm font-medium">{attemptsLabel}</Text>}

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label nativeID="charge-password-label">Senha do PDF</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
              aria-labelledby="charge-password-label"
            />
          )}
        />
        {errors.password && <Text className="text-sm text-error">{errors.password.message}</Text>}
      </View>

      {showRemember && (
        <View className="flex-row items-center justify-between gap-3">
          <Label nativeID="charge-remember-label" className="flex-1">
            Lembrar para este remetente
          </Label>
          <Controller
            control={control}
            name="rememberForSender"
            render={({ field: { value, onChange } }) => (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                disabled={isSubmitting}
                aria-labelledby="charge-remember-label"
              />
            )}
          />
        </View>
      )}

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Enviando...' : 'Enviar senha'}</Text>
      </Button>
      <Button variant="outline" onPress={onInformAmount} disabled={isSubmitting}>
        <Text>Informar o valor em vez da senha</Text>
      </Button>
    </ScrollView>
  );
}
