import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import type { PublicRoutes } from '@/navigation/public-routes/publicRoutes';
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestSchema,
} from '@/schemas/services/account/reset-password-request-schema';
import { useForgotPassword } from '@/services/account/forgot-password-service';
import { useResetPassword } from '@/services/account/reset-password-service';

import { ResetPasswordForm } from '../components/ResetPasswordForm';

export function ResetPasswordContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<PublicRoutes>>();
  const { phone } = useRoute<RouteProp<PublicRoutes, 'resetPassword'>>().params;
  const { mutate, isPending, error, reset: resetMutation } = useResetPassword();
  const { mutate: resend, isPending: isResending, error: resendError } = useForgotPassword();
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestSchema>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { code: '', password: '', passwordConfirm: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setResendMessage(null);
    mutate(
      { ...values, phone },
      {
        onSuccess: () => {
          Alert.alert('Senha redefinida', 'Senha redefinida. Entre com a nova senha.', [
            { text: 'OK', onPress: () => navigation.navigate('login') },
          ]);
        },
      }
    );
  });

  const onResend = () => {
    resetMutation();
    setResendMessage(null);
    resend({ phone }, { onSuccess: (message) => setResendMessage(message ?? 'Código reenviado.') });
  };

  return (
    <ResetPasswordForm
      control={control}
      errors={errors}
      isSubmitting={isPending}
      onSubmit={onSubmit}
      onResend={onResend}
      isResending={isResending}
      resendMessage={resendMessage}
      apiError={error ?? resendError}
    />
  );
}
