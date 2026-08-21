import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import type { CategoryRequestSchema } from '@/schemas/services/category/category-request-schema';
import type { CategoryPurpose } from '@/types/entities/category-purpose';

interface CategoryFormProps {
  control: Control<CategoryRequestSchema>;
  errors: FieldErrors<CategoryRequestSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  categoryPurposes: CategoryPurpose[];
  mode: 'create' | 'edit';
  apiError?: Error | null;
}

export function CategoryForm({
  control,
  errors,
  onSubmit,
  isSubmitting,
  categoryPurposes,
  mode,
  apiError,
}: CategoryFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>Descrição</Label>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Ex: Supermercado" />
          )}
        />
        {errors.description && <Text className="text-sm text-error">{errors.description.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Finalidade</Label>
        <Controller
          control={control}
          name="categoryPurposeId"
          render={({ field: { value, onChange } }) => {
            const selected = categoryPurposes.find((p) => p.categoryPurposeId === value);
            return (
              <Select
                value={selected ? { value: String(selected.categoryPurposeId), label: selected.name } : undefined}
                onValueChange={(option) => onChange(option ? Number(option.value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categoryPurposes.map((purpose) => (
                    <SelectItem
                      key={purpose.categoryPurposeId}
                      value={String(purpose.categoryPurposeId)}
                      label={purpose.name}
                    />
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.categoryPurposeId && (
          <Text className="text-sm text-error">{errors.categoryPurposeId.message}</Text>
        )}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar categoria' : 'Salvar alterações'}
        </Text>
      </Button>
    </View>
  );
}
