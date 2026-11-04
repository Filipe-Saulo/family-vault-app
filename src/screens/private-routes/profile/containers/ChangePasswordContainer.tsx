import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { logout } from '@/lib/session';
import {
  changePasswordRequestSchema,
  type ChangePasswordRequestSchema,
} from '@/schemas/services/account/change-password-request-schema';
import { useChangePassword } from '@/services/account/change-password-service';

import { ChangePasswordForm } from '../components/ChangePasswordForm';

export function ChangePasswordContainer() {
  const { mutate, isPending, error } = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordRequestSchema>({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues: { currentPassword: '', password: '', passwordConfirm: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        // The API revoked every session: leave the private area and go back to login.
        logout();
        Alert.alert('Senha alterada', 'Senha alterada. Entre novamente.');
      },
    });
  });

  return (
    <ChangePasswordForm control={control} errors={errors} isSubmitting={isPending} onSubmit={onSubmit} apiError={error} />
  );
}
