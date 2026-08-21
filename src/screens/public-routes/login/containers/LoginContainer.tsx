import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { loginRequestSchema, type LoginRequestSchema } from '@/schemas/services/account/login-request-schema';
import { useLogin } from '@/services/account/login-service';
import { useAuthStore } from '@/store/authStore';

import { LoginForm } from '../components/LoginForm';

export function LoginContainer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutate, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestSchema>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: (data) => {
        setAuth({ token: data.token, refreshToken: data.refreshToken ?? '', userId: data.userId });
      },
    });
  });

  return (
    <LoginForm control={control} errors={errors} isSubmitting={isPending} onSubmit={onSubmit} apiError={error} />
  );
}
