import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { buildManualBody, receivedAtToLocalDate } from '@/lib/charge-upload-failure';
import {
  manualChargeRequestSchema,
  type ManualChargeRequestSchema,
} from '@/schemas/services/charge/manual-charge-request-schema';
import { useCategoriesLookup } from '@/services/category/lookup-categories-service';
import { useCreateManualCharge } from '@/services/charge/create-manual-charge-service';
import type { ChargeFailure } from '@/types/entities/charge';
import { PurposeCode } from '@/types/enums/purpose-code';

import { ChargeManualForm } from '../components/ChargeManualForm';

interface ChargeManualContainerProps {
  failure: ChargeFailure;
}

export function ChargeManualContainer({ failure }: ChargeManualContainerProps) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: categoriesLookup } = useCategoriesLookup();
  // The manual charge creates an expense, so only expense categories are valid.
  const categories = useMemo(
    () => (categoriesLookup ?? []).filter((category) => category.purpose.code === PurposeCode.Expense),
    [categoriesLookup]
  );

  const { mutate: createManual, isPending, error } = useCreateManualCharge();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualChargeRequestSchema>({
    resolver: zodResolver(manualChargeRequestSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      dueDate: receivedAtToLocalDate(failure.receivedAt),
      issuer: failure.sender ?? '',
    },
  });

  const [description, amount, dueDate, categoryId] = useWatch({
    control,
    name: ['description', 'amount', 'dueDate', 'categoryId'],
  });
  const hasVisibleCategory = categories.some((category) => category.categoryId === categoryId);
  const canSubmit = Boolean(description?.trim()) && Boolean(amount) && Boolean(dueDate) && hasVisibleCategory;

  const onSubmit = handleSubmit((values) => {
    createManual(
      { documentId: failure.documentId, payload: buildManualBody(values) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['charges'] });
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
          navigation.goBack();
        },
        // 409: the document no longer waits for a password; refresh so the list stops showing it.
        onError: () => queryClient.invalidateQueries({ queryKey: ['charges', 'failures'] }),
      }
    );
  });

  return (
    <ChargeManualForm
      control={control}
      errors={errors}
      categories={categories}
      onSubmit={onSubmit}
      isSubmitting={isPending}
      canSubmit={canSubmit}
      apiError={error}
    />
  );
}
