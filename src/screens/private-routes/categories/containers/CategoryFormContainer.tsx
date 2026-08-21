import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
  categoryRequestSchema,
  type CategoryRequestSchema,
} from '@/schemas/services/category/category-request-schema';
import { useCategoryPurposes } from '@/services/category-purpose/list-category-purposes-service';
import { useCreateCategory } from '@/services/category/create-category-service';
import { useUpdateCategory } from '@/services/category/update-category-service';
import type { Category } from '@/types/entities/category';

import { CategoryForm } from '../components/CategoryForm';

interface CategoryFormContainerProps {
  category?: Category;
}

export function CategoryFormContainer({ category }: CategoryFormContainerProps) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: categoryPurposes } = useCategoryPurposes(true);

  const { mutate: createCategory, isPending: isCreating, error: createError } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating, error: updateError } = useUpdateCategory();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryRequestSchema>({
    resolver: zodResolver(categoryRequestSchema),
    defaultValues: {
      description: category?.description ?? '',
      categoryPurposeId: category?.purpose.categoryPurposeId,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigation.goBack();
    };

    if (category) {
      updateCategory({ categoryId: category.categoryId, payload: values }, { onSuccess });
    } else {
      createCategory(values, { onSuccess });
    }
  });

  return (
    <CategoryForm
      control={control}
      errors={errors}
      onSubmit={onSubmit}
      isSubmitting={isCreating || isUpdating}
      categoryPurposes={categoryPurposes ?? []}
      mode={category ? 'edit' : 'create'}
      apiError={createError ?? updateError}
    />
  );
}
