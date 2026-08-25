import { Mail, Phone } from 'lucide-react-native';
import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneField } from '@/components/ui/phone-field';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/react-native-reusables/utils';
import type { LoginRequestSchema } from '@/schemas/services/account/login-request-schema';

interface LoginFormProps {
  control: Control<LoginRequestSchema>;
  errors: FieldErrors<LoginRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onMethodChange: (method: 'email' | 'phone') => void;
  apiError?: Error | null;
}

export function LoginForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onMethodChange,
  apiError,
}: LoginFormProps) {
  const method = useWatch({ control, name: 'method' });

  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="flex-row gap-2">
        <Button
          className={cn('flex-1')}
          variant={method === 'phone' ? 'default' : 'outline'}
          onPress={() => onMethodChange('phone')}>
          <Icon as={Phone} />
          <Text>Telefone</Text>
        </Button>
        <Button
          className={cn('flex-1')}
          variant={method === 'email' ? 'default' : 'outline'}
          onPress={() => onMethodChange('email')}>
          <Icon as={Mail} />
          <Text>E-mail</Text>
        </Button>
      </View>

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
              <PhoneField value={value} onChange={onChange} onBlur={onBlur} placeholder="11987654321" />
            )}
          />
          {errors.phone && <Text className="text-sm text-error">{errors.phone.message}</Text>}
        </View>
      )}

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
