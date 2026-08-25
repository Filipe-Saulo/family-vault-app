import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneField } from '@/components/ui/phone-field';
import { Text } from '@/components/ui/text';
import type { RegisterRequestSchema } from '@/schemas/services/account/register-request-schema';

interface RegisterFormProps {
  control: Control<RegisterRequestSchema>;
  errors: FieldErrors<RegisterRequestSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  apiError?: Error | null;
}

export function RegisterForm({ control, errors, isSubmitting, onSubmit, apiError }: RegisterFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>Nome</Label>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input placeholder="Ex: Maria" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.firstName && <Text className="text-sm text-error">{errors.firstName.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Sobrenome</Label>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input placeholder="Ex: Silva" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors.lastName && <Text className="text-sm text-error">{errors.lastName.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Idade</Label>
        <Controller
          control={control}
          name="age"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value === undefined ? '' : String(value)}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
              onBlur={onBlur}
              keyboardType="number-pad"
              placeholder="Ex: 30"
            />
          )}
        />
        {errors.age && <Text className="text-sm text-error">{errors.age.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Telefone</Label>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { value, onChange, onBlur } }) => (
            <PhoneField value={value} onChange={onChange} onBlur={onBlur} placeholder="11987654321" />
          )}
        />
        {errors.phoneNumber && <Text className="text-sm text-error">{errors.phoneNumber.message}</Text>}
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

      <View className="gap-1.5">
        <Label>Confirmar senha</Label>
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
        <Text>{isSubmitting ? 'Criando conta...' : 'Criar conta'}</Text>
      </Button>
    </View>
  );
}
