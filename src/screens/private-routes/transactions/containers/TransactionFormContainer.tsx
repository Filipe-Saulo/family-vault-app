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
import type { Transaction } from '@/types/entities/transaction';

import { TransactionForm } from '../components/TransactionForm';

interface TransactionFormContainerProps {
  transaction?: Transaction;
}

export function TransactionFormContainer({ transaction }: TransactionFormContainerProps) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

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
    if (!transactionTypeId) return;
    const stillValid = transactionTypeOptions.some((t) => t.transactionTypeId === transactionTypeId);
    if (!stillValid) {
      setValue('transactionTypeId', undefined as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const onSubmit = handleSubmit((values) => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
      createTransaction(values, { onSuccess });
    }
  });

  return (
    <TransactionForm
      control={control}
      errors={errors}
      onSubmit={onSubmit}
      isSubmitting={isCreating || isUpdating}
      categories={categories}
      transactionTypeOptions={transactionTypeOptions}
      mode={transaction ? 'edit' : 'create'}
      apiError={createError ?? updateError}
    />
  );
}
