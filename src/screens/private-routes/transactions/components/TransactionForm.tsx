import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
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

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface TransactionFormProps {
  control: Control<CreateTransactionRequestSchema>;
  errors: FieldErrors<CreateTransactionRequestSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  categories: Category[];
  transactionTypeOptions: TransactionType[];
  hasCategorySelected: boolean;
  mode: 'create' | 'edit';
  apiError?: Error | null;
}

export function TransactionForm({
  control,
  errors,
  onSubmit,
  isSubmitting,
  canSubmit,
  categories,
  transactionTypeOptions,
  hasCategorySelected,
  mode,
  apiError,
}: TransactionFormProps) {
  return (
    <View className="gap-4">
      {apiError && <Text className="text-center text-sm text-error">{apiError.message}</Text>}

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
                  <SelectValue
                    placeholder={hasCategorySelected ? 'Selecione o tipo' : 'Selecione a categoria primeiro'}
                  />
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

      <View className="gap-1.5">
        <Label>Valor</Label>
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value ? currencyFormatter.format(value) : ''}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '');
                const amount = digits ? Number(digits) / 100 : 0;
                onChange(amount > 0 ? amount : undefined);
              }}
              onBlur={onBlur}
              keyboardType="number-pad"
              placeholder="R$ 0,00"
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
            <DateField value={value} onChange={onChange} onBlur={onBlur} />
          )}
        />
        {errors.transactionDate && (
          <Text className="text-sm text-error">{errors.transactionDate.message}</Text>
        )}
      </View>

      <View className="gap-1.5">
        <Label>Detalhes</Label>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Ex: Compras do mês" />
          )}
        />
        {errors.description && <Text className="text-sm text-error">{errors.description.message}</Text>}
      </View>

      <Button onPress={onSubmit} disabled={isSubmitting || !canSubmit}>
        <Text>
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar transação' : 'Salvar alterações'}
        </Text>
      </Button>
    </View>
  );
}
