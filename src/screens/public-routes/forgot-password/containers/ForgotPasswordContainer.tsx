import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import type { PublicRoutes } from '@/navigation/public-routes/publicRoutes';
import type { VerificationMethod } from '@/schemas/services/account/contact-issues';
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
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordRequestSchema>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { method: 'sms', phone: '', email: '' },
  });

  const onMethodChange = (method: VerificationMethod) => {
    setValue('method', method);
  };

  const onSubmit = handleSubmit((values) => {
    const destination = values.method === 'email' ? { email: values.email } : { phone: values.phone };
    mutate(values, {
      onSuccess: () => navigation.navigate('resetPassword', { ...destination, sentAt: Date.now() }),
    });
  });

  return (
    <ForgotPasswordForm
      control={control}
      errors={errors}
      isSubmitting={isPending}
      onSubmit={onSubmit}
      onMethodChange={onMethodChange}
      apiError={error}
    />
  );
}
