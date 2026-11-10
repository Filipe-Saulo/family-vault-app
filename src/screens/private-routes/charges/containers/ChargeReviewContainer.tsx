import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  confirmChargeRequestSchema,
  type ConfirmChargeRequestSchema,
} from '@/schemas/services/charge/confirm-charge-request-schema';
import { useCategoriesLookup } from '@/services/category/lookup-categories-service';
import { useConfirmCharge } from '@/services/charge/confirm-charge-service';
import { useDismissCharge } from '@/services/charge/dismiss-charge-service';
import type { Charge } from '@/types/entities/charge';
import { PurposeCode } from '@/types/enums/purpose-code';

import { ChargeReviewForm } from '../components/ChargeReviewForm';

interface ChargeReviewContainerProps {
  charge: Charge;
}

export function ChargeReviewContainer({ charge }: ChargeReviewContainerProps) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isDismissOpen, setIsDismissOpen] = useState(false);

  const { data: categoriesLookup } = useCategoriesLookup();
  // Confirming creates an expense, so only expense categories are valid.
  const categories = useMemo(
    () => (categoriesLookup ?? []).filter((category) => category.purpose.code === PurposeCode.Expense),
    [categoriesLookup]
  );

  const { mutate: confirmCharge, isPending: isConfirming, error: confirmError } = useConfirmCharge();
  const {
    mutate: dismissCharge,
    isPending: isDismissing,
    error: dismissError,
    reset: resetDismiss,
  } = useDismissCharge();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ConfirmChargeRequestSchema>({
    resolver: zodResolver(confirmChargeRequestSchema),
    defaultValues: {
      description: charge.description ?? charge.issuer ?? '',
      amount: charge.amount ?? undefined,
      dueDate: charge.dueDate?.slice(0, 10) ?? '',
    },
  });

  // Pre-select the suggested category only once it shows up among the expense categories, so the form never
  // submits a category the user cannot see.
  useEffect(() => {
    const suggested = charge.suggestedCategoryId;
    if (
      suggested != null &&
      getValues('categoryId') === undefined &&
      categories.some((category) => category.categoryId === suggested)
    ) {
      setValue('categoryId', suggested);
    }
  }, [categories, charge.suggestedCategoryId, getValues, setValue]);

  const [description, amount, dueDate, categoryId] = useWatch({
    control,
    name: ['description', 'amount', 'dueDate', 'categoryId'],
  });
  const hasVisibleCategory = categories.some((category) => category.categoryId === categoryId);
  const canSubmit = Boolean(description?.trim()) && Boolean(amount) && Boolean(dueDate) && hasVisibleCategory;

  // A 409 means the bill was already handled elsewhere: refresh the list so it stops showing it.
  const refreshCharges = () => queryClient.invalidateQueries({ queryKey: ['charges'] });

  const onConfirm = handleSubmit((values) => {
    confirmCharge(
      { chargeId: charge.chargeId, payload: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['charges'] });
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
          navigation.goBack();
        },
        onError: refreshCharges,
      }
    );
  });

  const onDismiss = () => {
    dismissCharge(charge.chargeId, {
      onSuccess: () => {
        setIsDismissOpen(false);
        queryClient.invalidateQueries({ queryKey: ['charges'] });
        navigation.goBack();
      },
      onError: refreshCharges,
    });
  };

  return (
    <>
      <ChargeReviewForm
        charge={charge}
        control={control}
        errors={errors}
        categories={categories}
        onConfirm={onConfirm}
        onDismiss={() => setIsDismissOpen(true)}
        isConfirming={isConfirming}
        canSubmit={canSubmit && !isDismissing}
        apiError={confirmError}
      />
      <ConfirmDialog
        open={isDismissOpen}
        onOpenChange={setIsDismissOpen}
        title="Descartar conta"
        description="A conta sai da lista e nenhuma despesa é criada. Essa ação não pode ser desfeita."
        confirmLabel="Descartar"
        isConfirming={isDismissing}
        errorMessage={dismissError?.message}
        onOpen={resetDismiss}
        onConfirm={onDismiss}
      />
    </>
  );
}
