import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { MCP_TOKEN_VALIDITY_OPTIONS } from '@/lib/mcp-tokens';
import type { CreateMcpTokenRequestSchema } from '@/schemas/services/mcp-token/create-mcp-token-request-schema';

interface McpTokenCreateFormProps {
  control: Control<CreateMcpTokenRequestSchema>;
  errors: FieldErrors<CreateMcpTokenRequestSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  apiErrorMessage: string | null;
}

export function McpTokenCreateForm({ control, errors, onSubmit, isSubmitting, apiErrorMessage }: McpTokenCreateFormProps) {
  return (
    <View className="gap-4">
      <View className="gap-1.5">
        <Label>Nome</Label>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Ex.: Claude Code no notebook" />
          )}
        />
        {errors.name && <Text className="text-sm text-error">{errors.name.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Validade</Label>
        <Controller
          control={control}
          name="expiresInDays"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row gap-2">
              {MCP_TOKEN_VALIDITY_OPTIONS.map((days) => (
                <Button
                  key={days}
                  className="flex-1"
                  variant={value === days ? 'default' : 'outline'}
                  accessibilityLabel={`Validade de ${days} dias`}
                  onPress={() => onChange(days)}>
                  <Text>{days} dias</Text>
                </Button>
              ))}
            </View>
          )}
        />
      </View>

      {apiErrorMessage && <Text className="text-sm text-error">{apiErrorMessage}</Text>}

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Criando...' : 'Criar token'}</Text>
      </Button>
    </View>
  );
}
