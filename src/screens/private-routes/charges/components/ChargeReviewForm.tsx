import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateField } from '@/components/ui/date-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import type { ConfirmChargeRequestSchema } from '@/schemas/services/charge/confirm-charge-request-schema';
import type { Category } from '@/types/entities/category';
import type { Charge } from '@/types/entities/charge';

import { DUPLICATE_WARNING } from './ChargeList';

interface ChargeReviewFormProps {
  charge: Charge;
  control: Control<ConfirmChargeRequestSchema>;
  errors: FieldErrors<ConfirmChargeRequestSchema>;
  categories: Category[];
  onConfirm: () => void;
  onDismiss: () => void;
  isConfirming: boolean;
  canSubmit: boolean;
  apiError?: Error | null;
}

export function ChargeReviewForm({
  charge,
  control,
  errors,
  categories,
  onConfirm,
  onDismiss,
  isConfirming,
  canSubmit,
  apiError,
}: ChargeReviewFormProps) {
  return (
    <ScrollView contentContainerClassName="gap-4 pb-8" keyboardShouldPersistTaps="handled">
      {charge.possibleDuplicateTransactionId != null && (
        <Card className="border-amber-500">
          <CardContent>
            <Text className="text-sm text-amber-600 dark:text-amber-400">{DUPLICATE_WARNING}</Text>
          </CardContent>
        </Card>
      )}

      {(charge.issuer || charge.barcode) && (
        <View className="gap-1">
          {charge.issuer && (
            <Text variant="muted" className="text-sm">
              Emissor: {charge.issuer}
            </Text>
          )}
          {charge.barcode && (
            <Text variant="muted" className="text-sm" selectable>
              Linha digitável: {charge.barcode}
            </Text>
          )}
        </View>
      )}

      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label nativeID="charge-description-label">Descrição</Label>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ex: Conta de luz"
              aria-labelledby="charge-description-label"
            />
          )}
        />
        {errors.description && <Text className="text-sm text-error">{errors.description.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label nativeID="charge-amount-label">Valor</Label>
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
              aria-labelledby="charge-amount-label"
              placeholder="R$ 0,00"
            />
          )}
        />
        {errors.amount && <Text className="text-sm text-error">{errors.amount.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label nativeID="charge-due-date-label">Vencimento</Label>
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
        Confirmar cria uma despesa com a data do vencimento.
      </Text>

      <Button onPress={onConfirm} disabled={isConfirming || !canSubmit}>
        <Text>{isConfirming ? 'Confirmando...' : 'Confirmar e criar despesa'}</Text>
      </Button>
      <Button variant="outline" onPress={onDismiss} disabled={isConfirming}>
        <Text>Descartar</Text>
      </Button>
    </ScrollView>
  );
}
