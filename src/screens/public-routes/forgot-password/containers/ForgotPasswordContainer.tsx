import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import type { PublicRoutes } from '@/navigation/public-routes/publicRoutes';
import {
  forgotPasswordRequestSchema,
  type ForgotPasswordRequestSchema,
} from '@/schemas/services/account/forgot-password-request-schema';
import { useForgotPassword } from '@/services/account/forgot-password-service';

import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPasswordContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<PublicRoutes>>();
  const { mutate, isPending, error } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequestSchema>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => navigation.navigate('resetPassword', { phone: values.phone }),
    });
  });

  return (
    <ForgotPasswordForm control={control} errors={errors} isSubmitting={isPending} onSubmit={onSubmit} apiError={error} />
  );
}
