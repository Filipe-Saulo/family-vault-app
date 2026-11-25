import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { buildPasswordBody, canRememberForSender, formatAttemptsRemaining } from '@/lib/charge-upload-failure';
import type { ChargesStackRoutes } from '@/navigation/private-routes/charges-stack/chargesRoutes';
import {
  chargePasswordRequestSchema,
  type ChargePasswordRequestSchema,
} from '@/schemas/services/charge/charge-password-request-schema';
import { useSubmitChargePassword } from '@/services/charge/submit-charge-password-service';
import type { ChargeFailure } from '@/types/entities/charge';
import type { PagedResult } from '@/types/entities/paged-result';

import { ChargePasswordForm } from '../components/ChargePasswordForm';

export const PASSWORD_ACCEPTED_NOTICE =
  'Senha enviada. A conta aparece em "Para revisar" assim que a leitura terminar.';

interface ChargePasswordContainerProps {
  failure: ChargeFailure;
}

export function ChargePasswordContainer({ failure }: ChargePasswordContainerProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ChargesStackRoutes>>();
  const queryClient = useQueryClient();
  const { mutate: submitPassword, isPending, error } = useSubmitChargePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChargePasswordRequestSchema>({
    resolver: zodResolver(chargePasswordRequestSchema),
    defaultValues: { password: '', rememberForSender: false },
  });

  // 400 (wrong password), 409 and 429 change the attempts left or the document state: refresh the failures list
  // and update this screen's copy of the item, so "Restam N" follows the API.
  const refreshFailures = async () => {
    await queryClient.invalidateQueries({ queryKey: ['charges', 'failures'] });
    const pages = queryClient.getQueriesData<InfiniteData<PagedResult<ChargeFailure>>>({ queryKey: ['charges', 'failures'] });
    const updated = pages
      .flatMap(([, data]) => data?.pages.flatMap((page) => page.items) ?? [])
      .find((item) => item.documentId === failure.documentId);
    if (updated) navigation.setParams({ failure: updated });
  };

  const onSubmit = handleSubmit((values) => {
    submitPassword(
      {
        documentId: failure.documentId,
        payload: buildPasswordBody(failure, values.password, values.rememberForSender),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['charges'] });
          navigation.popTo('charges', { notice: PASSWORD_ACCEPTED_NOTICE });
        },
        onError: refreshFailures,
      }
    );
  });

  return (
    <ChargePasswordForm
      control={control}
      errors={errors}
      sender={failure.sender}
      attemptsLabel={formatAttemptsRemaining(failure.passwordAttemptsRemaining)}
      showRemember={canRememberForSender(failure)}
      onSubmit={onSubmit}
      onInformAmount={() => navigation.replace('chargeManual', { failure })}
      isSubmitting={isPending}
      apiError={error}
    />
  );
}
