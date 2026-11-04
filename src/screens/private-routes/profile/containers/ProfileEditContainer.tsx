import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  updateUserRequestSchema,
  type UpdateUserRequestSchema,
} from '@/schemas/services/user/update-user-request-schema';
import { useMe } from '@/services/user/get-me-service';
import { useUpdateUser } from '@/services/user/update-user-service';
import { useAuthStore } from '@/store/authStore';

import { ProfileEditForm } from '../components/ProfileEditForm';

export function ProfileEditContainer() {
  const userId = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { mutate, isPending, error } = useUpdateUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserRequestSchema>({
    resolver: zodResolver(updateUserRequestSchema),
    defaultValues: { firstName: '', lastName: '', age: undefined },
  });

  useEffect(() => {
    if (me) reset({ firstName: me.firstName, lastName: me.lastName, age: me.age });
  }, [me, reset]);

  const onSubmit = handleSubmit((values) => {
    if (!userId) return;
    setSuccessMessage(null);
    mutate(
      { userId, payload: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['me'] });
          setSuccessMessage('Dados atualizados com sucesso.');
        },
      }
    );
  });

  return (
    <ProfileEditForm
      control={control}
      errors={errors}
      onSubmit={onSubmit}
      isSubmitting={isPending}
      apiError={error}
      successMessage={successMessage}
    />
  );
}
