import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import type { UpdateUserRequestSchema } from '@/schemas/services/user/update-user-request-schema';

interface ProfileEditFormProps {
  control: Control<UpdateUserRequestSchema>;
  errors: FieldErrors<UpdateUserRequestSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  apiError?: Error | null;
  successMessage?: string | null;
}

export function ProfileEditForm({
  control,
  errors,
  onSubmit,
  isSubmitting,
  apiError,
  successMessage,
}: ProfileEditFormProps) {
  return (
    <View className="gap-4">
      <Text variant="muted" className="text-sm">
        Não é possível carregar seus dados atuais nesta versão do app — preencha os campos abaixo para
        atualizar seu cadastro.
      </Text>

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}
      {successMessage && <Text className="text-center text-sm text-success">{successMessage}</Text>}

      <View className="gap-1.5">
        <Label>Nome</Label>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} />
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
            <Input value={value} onChangeText={onChange} onBlur={onBlur} />
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
            />
          )}
        />
        {errors.age && <Text className="text-sm text-error">{errors.age.message}</Text>}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Salvando...' : 'Salvar'}</Text>
      </Button>
    </View>
  );
}
