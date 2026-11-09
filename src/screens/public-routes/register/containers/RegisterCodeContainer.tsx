import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useResendCountdown } from '@/lib/resend-countdown';
import type { PublicRoutes } from '@/navigation/public-routes/publicRoutes';
import {
  registerCodeSchema,
  type RegisterCodeSchema,
} from '@/schemas/services/account/register-request-schema';
import { useRegister, useRegisterCode } from '@/services/account/register-service';

import { RegisterCodeForm } from '../components/RegisterCodeForm';

export function RegisterCodeContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<PublicRoutes>>();
  const { form, sentAt } = useRoute<RouteProp<PublicRoutes, 'registerCode'>>().params;
  const { mutate, isPending, error, reset: resetMutation } = useRegister();
  const { mutate: resend, isPending: isResending, error: resendError } = useRegisterCode();
  const { remaining, restart } = useResendCountdown(sentAt);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCodeSchema>({
    resolver: zodResolver(registerCodeSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = handleSubmit(({ code }) => {
    setResendMessage(null);
    mutate(
      { ...form, code },
      {
        onSuccess: (message) => {
          Alert.alert('Conta criada', message ?? 'Cadastro realizado com sucesso. Faça login para continuar.', [
            { text: 'OK', onPress: () => navigation.navigate('login') },
          ]);
        },
      }
    );
  });

  const onResend = () => {
    resetMutation();
    setResendMessage(null);
    resend(form, {
      onSuccess: () => {
        restart();
        setResendMessage('Se os dados estiverem corretos, você receberá um código.');
      },
    });
  };

  return (
    <RegisterCodeForm
      control={control}
      errors={errors}
      isSubmitting={isPending}
      onSubmit={onSubmit}
      onResend={onResend}
      isResending={isResending}
      resendRemaining={remaining}
      resendMessage={resendMessage}
      apiError={error ?? resendError}
    />
  );
}
