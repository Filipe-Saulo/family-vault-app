import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import type { ManualChargeRequestSchema } from '@/schemas/services/charge/manual-charge-request-schema';
import type { Category } from '@/types/entities/category';

interface ChargeManualFormProps {
  control: Control<ManualChargeRequestSchema>;
  errors: FieldErrors<ManualChargeRequestSchema>;
  categories: Category[];
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  apiError?: Error | null;
}

// Same fields as ChargeReviewForm, without the charge-specific parts (duplicate warning, dismiss).
export function ChargeManualForm({
  control,
  errors,
  categories,
  onSubmit,
  isSubmitting,
  canSubmit,
  apiError,
}: ChargeManualFormProps) {
  return (
    <ScrollView contentContainerClassName="gap-4 pb-8" keyboardShouldPersistTaps="handled">
      <Text variant="muted" className="text-sm">
        Informe os dados da conta para criar a despesa sem ler o PDF.
      </Text>

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label nativeID="manual-issuer-label">Emissor (opcional)</Label>
        <Controller
          control={control}
          name="issuer"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ex: Companhia de energia"
              aria-labelledby="manual-issuer-label"
            />
          )}
        />
      </View>

      <View className="gap-1.5">
        <Label nativeID="manual-description-label">Descrição</Label>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ex: Conta de luz"
              aria-labelledby="manual-description-label"
            />
          )}
        />
        {errors.description && <Text className="text-sm text-error">{errors.description.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label nativeID="manual-amount-label">Valor</Label>
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value ? formatCurrency(value) : ''}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '');
                const amount = digits ? Number(digits) / 100 : 0;
                onChange(amount > 0 ? amount : undefined);
              }}
              onBlur={onBlur}
              keyboardType="number-pad"
              aria-labelledby="manual-amount-label"
              placeholder="R$ 0,00"
            />
          )}
        />
        {errors.amount && <Text className="text-sm text-error">{errors.amount.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label nativeID="manual-due-date-label">Vencimento</Label>
        <Controller
          control={control}
          name="dueDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <DateField value={value} onChange={onChange} onBlur={onBlur} />
          )}
        />
        {errors.dueDate && <Text className="text-sm text-error">{errors.dueDate.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Categoria</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange } }) => {
            const selected = categories.find((c) => c.categoryId === value);
            return (
              <Select
                value={selected ? { value: String(selected.categoryId), label: selected.description } : undefined}
                onValueChange={(option) => onChange(option ? Number(option.value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={String(category.categoryId)}
                      label={category.description}
                    />
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.categoryId && <Text className="text-sm text-error">{errors.categoryId.message}</Text>}
      </View>

      <Text variant="muted" className="text-xs">
        Isso cria uma despesa com a data do vencimento.
      </Text>

      <Button onPress={onSubmit} disabled={isSubmitting || !canSubmit}>
        <Text>{isSubmitting ? 'Criando...' : 'Criar despesa'}</Text>
      </Button>
    </ScrollView>
  );
}
