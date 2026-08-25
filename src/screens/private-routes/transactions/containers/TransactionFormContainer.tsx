import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  createTransactionRequestSchema,
  type CreateTransactionRequestSchema,
} from '@/schemas/services/transaction/create-transaction-request-schema';
import { useCategories } from '@/services/category/list-categories-service';
import { useCategoryPurposes } from '@/services/category-purpose/list-category-purposes-service';
import { useCreateTransaction } from '@/services/transaction/create-transaction-service';
import { useUpdateTransaction } from '@/services/transaction/update-transaction-service';
import { useTransactionTypes } from '@/services/transaction-type/list-transaction-types-service';
import { useAuthStore } from '@/store/authStore';
import type { Transaction } from '@/types/entities/transaction';

import { TransactionForm } from '../components/TransactionForm';

interface TransactionFormContainerProps {
  transaction?: Transaction;
}

export function TransactionFormContainer({ transaction }: TransactionFormContainerProps) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  const { data: categoriesResult } = useCategories({ pageSize: 100 });
  const { data: categoryPurposes } = useCategoryPurposes(true);
  const { data: transactionTypes } = useTransactionTypes(true);
  const categories = categoriesResult?.items ?? [];

  const { mutate: createTransaction, isPending: isCreating, error: createError } = useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating, error: updateError } = useUpdateTransaction();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTransactionRequestSchema>({
    resolver: zodResolver(createTransactionRequestSchema),
    defaultValues: {
      categoryId: transaction?.category.categoryId,
      transactionTypeId: transaction?.transactionType.transactionTypeId,
      description: transaction?.description ?? '',
      amount: transaction?.amount,
      transactionDate: transaction?.transactionDate.slice(0, 10) ?? '',
    },
  });

  const categoryId = useWatch({ control, name: 'categoryId' });
  const transactionTypeId = useWatch({ control, name: 'transactionTypeId' });
  const amount = useWatch({ control, name: 'amount' });
  const transactionDate = useWatch({ control, name: 'transactionDate' });

  const canSubmit = Boolean(categoryId) && Boolean(transactionTypeId) && Boolean(amount) && Boolean(transactionDate);

  const selectedCategory = categories.find((c) => c.categoryId === categoryId);
  const selectedPurpose = categoryPurposes?.find(
    (purpose) => purpose.categoryPurposeId === selectedCategory?.purpose.categoryPurposeId
  );

  // Filter the type options to those whose Code matches the selected category's
  // Purpose.Code - the API rejects a mismatched pair on create/update.
  const transactionTypeOptions = selectedPurpose
    ? (transactionTypes ?? []).filter((type) => type.code === selectedPurpose.code)
    : (transactionTypes ?? []);

  useEffect(() => {
    const stillValid = transactionTypeOptions.some((t) => t.transactionTypeId === transactionTypeId);
    if (transactionTypeId && !stillValid) {
      setValue('transactionTypeId', undefined as never);
    }
    // Auto-fill when the category leaves exactly one valid type - the user only
    // has to pick manually when the purpose is genuinely ambiguous.
    if (transactionTypeOptions.length === 1 && transactionTypeOptions[0].transactionTypeId !== transactionTypeId) {
      setValue('transactionTypeId', transactionTypeOptions[0].transactionTypeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, transactionTypes]);

  const onSubmit = handleSubmit((values) => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      navigation.goBack();
    };

    if (transaction) {
      updateTransaction(
        {
          transactionId: transaction.transactionId,
          payload: {
            categoryId: values.categoryId,
            transactionTypeId: values.transactionTypeId,
            description: values.description,
            amount: values.amount,
            transactionDate: values.transactionDate,
          },
        },
        { onSuccess }
      );
    } else {
      createTransaction({ ...values, userId: userId ?? undefined }, { onSuccess });
    }
  });

  return (
    <TransactionForm
      control={control}
      errors={errors}
      onSubmit={onSubmit}
      isSubmitting={isCreating || isUpdating}
      canSubmit={canSubmit}
      categories={categories}
      transactionTypeOptions={transactionTypeOptions}
      hasCategorySelected={Boolean(categoryId)}
      mode={transaction ? 'edit' : 'create'}
      apiError={createError ?? updateError}
    />
  );
}
