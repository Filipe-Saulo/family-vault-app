import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateField } from '@/components/ui/date-field';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { formatBarcode, onlyDigits } from '@/lib/barcode';
import { DUPLICATE_CHARGE_WARNING, EMAIL_BODY_WARNING } from '@/lib/charge-upload-failure';
import { formatCurrency } from '@/lib/format';
import type { ConfirmChargeRequestSchema } from '@/schemas/services/charge/confirm-charge-request-schema';
import { useCharge } from '@/services/charge/get-charge-service';
import type { Category } from '@/types/entities/category';
import type { Charge } from '@/types/entities/charge';

import { DUPLICATE_WARNING } from './ChargeList';

interface DuplicateChargeNoticeProps {
  chargeId: number;
  onOpen: (charge: Charge) => void;
}

// Only offers the button while the other charge is still waiting for review.
function DuplicateChargeNotice({ chargeId, onOpen }: DuplicateChargeNoticeProps) {
  const { data: other } = useCharge(chargeId);

  return (
    <Card className="border-amber-500">
      <CardContent className="gap-2">
        <Text className="text-sm text-amber-600 dark:text-amber-400">{DUPLICATE_CHARGE_WARNING}</Text>
        {other?.status === 'PendingReview' && (
          <Button
            variant="outline"
            size="sm"
            accessibilityRole="button"
            accessibilityLabel="Abrir a outra conta em revisão"
            onPress={() => onOpen(other)}>
            <Text>Abrir a outra conta</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const COPIED_FEEDBACK_MS = 2000;

// The line is shown grouped as printed on the slip, and copied as digits only, which is what banking apps accept.
function BarcodeField({ barcode }: { barcode: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(onlyDigits(barcode) || barcode.trim());
    setCopied(true);
  };

  return (
    <View className="gap-1.5">
      <Text variant="muted" className="text-sm">
        Linha digitável
      </Text>
      <Text className="font-mono text-sm leading-6" selectable>
        {formatBarcode(barcode)}
      </Text>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        accessibilityRole="button"
        accessibilityLabel="Copiar linha digitável"
        onPress={handleCopy}>
        <Icon as={copied ? Check : Copy} />
        <Text>{copied ? 'Copiada' : 'Copiar'}</Text>
      </Button>
    </View>
  );
}

interface ChargeReviewFormProps {
  charge: Charge;
  control: Control<ConfirmChargeRequestSchema>;
  errors: FieldErrors<ConfirmChargeRequestSchema>;
  categories: Category[];
  onConfirm: () => void;
  onDismiss: () => void;
  onOpenDuplicate: (charge: Charge) => void;
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
  onOpenDuplicate,
  isConfirming,
  canSubmit,
  apiError,
}: ChargeReviewFormProps) {
  return (
    <ScrollView contentContainerClassName="gap-4 pb-8" keyboardShouldPersistTaps="handled">
      {charge.extractionSource === 'EmailBody' && (
        <Card className="border-amber-500">
          <CardContent>
            <Text className="text-sm text-amber-600 dark:text-amber-400">{EMAIL_BODY_WARNING}</Text>
          </CardContent>
        </Card>
      )}

      {charge.possibleDuplicateChargeId != null && (
        <DuplicateChargeNotice chargeId={charge.possibleDuplicateChargeId} onOpen={onOpenDuplicate} />
      )}

      {charge.possibleDuplicateTransactionId != null && (
        <Card className="border-amber-500">
          <CardContent>
            <Text className="text-sm text-amber-600 dark:text-amber-400">{DUPLICATE_WARNING}</Text>
          </CardContent>
        </Card>
      )}

      {charge.issuer && (
        <Text variant="muted" className="text-sm">
          Emissor: {charge.issuer}
        </Text>
      )}

      {charge.barcode && <BarcodeField barcode={charge.barcode} />}

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
