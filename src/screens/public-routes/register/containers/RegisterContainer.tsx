import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import {
  registerRequestSchema,
  type RegisterRequestSchema,
} from '@/schemas/services/account/register-request-schema';
import { useRegister } from '@/services/account/register-service';

import { RegisterForm } from '../components/RegisterForm';

export function RegisterContainer() {
  const navigation = useNavigation();
  const { mutate, isPending, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequestSchema>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: undefined,
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: (message) => {
        Alert.alert('Conta criada', message ?? 'Cadastro realizado com sucesso. Faça login para continuar.', [
          { text: 'OK', onPress: () => navigation.navigate('login' as never) },
        ]);
      },
    });
  });

  return (
    <RegisterForm control={control} errors={errors} isSubmitting={isPending} onSubmit={onSubmit} apiError={error} />
  );
}
