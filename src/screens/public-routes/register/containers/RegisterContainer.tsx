import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import type { PublicRoutes } from '@/navigation/public-routes/publicRoutes';
import type { VerificationMethod } from '@/schemas/services/account/contact-issues';
import {
  registerRequestSchema,
  type RegisterRequestSchema,
} from '@/schemas/services/account/register-request-schema';
import { useRegisterCode } from '@/services/account/register-service';

import { RegisterForm } from '../components/RegisterForm';

export function RegisterContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<PublicRoutes>>();
  const { mutate, isPending, error } = useRegisterCode();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterRequestSchema>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: undefined,
      method: 'sms',
      phoneNumber: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onMethodChange = (method: VerificationMethod) => {
    setValue('method', method);
  };

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => navigation.navigate('registerCode', { form: values, sentAt: Date.now() }),
    });
  });

  return (
    <RegisterForm
      control={control}
      errors={errors}
      isSubmitting={isPending}
      onSubmit={onSubmit}
      onMethodChange={onMethodChange}
      apiError={error}
    />
  );
}
