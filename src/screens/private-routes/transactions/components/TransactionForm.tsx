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
import type { CreateTransactionRequestSchema } from '@/schemas/services/transaction/create-transaction-request-schema';
import type { Category } from '@/types/entities/category';
import type { TransactionType } from '@/types/entities/transaction-type';

interface TransactionFormProps {
  control: Control<CreateTransactionRequestSchema>;
  errors: FieldErrors<CreateTransactionRequestSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  categories: Category[];
  transactionTypeOptions: TransactionType[];
  mode: 'create' | 'edit';
  apiError?: Error | null;
}

export function TransactionForm({
  control,
  errors,
  onSubmit,
  isSubmitting,
  categories,
  transactionTypeOptions,
  mode,
  apiError,
}: TransactionFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

      <View className="gap-1.5">
        <Label>Descrição</Label>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Ex: Compras do mês" />
          )}
        />
        {errors.description && <Text className="text-sm text-error">{errors.description.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Valor</Label>
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value === undefined ? '' : String(value)}
              onChangeText={(text) => onChange(text ? Number(text.replace(',', '.')) : undefined)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="0,00"
            />
          )}
        />
        {errors.amount && <Text className="text-sm text-error">{errors.amount.message}</Text>}
      </View>

      <View className="gap-1.5">
        <Label>Data</Label>
        <Controller
          control={control}
          name="transactionDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} placeholder="AAAA-MM-DD" />
          )}
        />
        {errors.transactionDate && (
          <Text className="text-sm text-error">{errors.transactionDate.message}</Text>
        )}
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

      <View className="gap-1.5">
        <Label>Tipo</Label>
        <Controller
          control={control}
          name="transactionTypeId"
          render={({ field: { value, onChange } }) => {
            const selected = transactionTypeOptions.find((t) => t.transactionTypeId === value);
            return (
              <Select
                value={selected ? { value: String(selected.transactionTypeId), label: selected.name } : undefined}
                onValueChange={(option) => onChange(option ? Number(option.value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria primeiro" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypeOptions.map((type) => (
                    <SelectItem
                      key={type.transactionTypeId}
                      value={String(type.transactionTypeId)}
                      label={type.name}
                    />
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.transactionTypeId && (
          <Text className="text-sm text-error">{errors.transactionTypeId.message}</Text>
        )}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting}>
        <Text>
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar transação' : 'Salvar alterações'}
        </Text>
      </Button>
    </View>
  );
}
