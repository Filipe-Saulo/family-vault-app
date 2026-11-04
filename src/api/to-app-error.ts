import { isAxiosError } from 'axios';

import { AppError } from '@/errors/AppError';
import type { ApiResponse } from '@/types/entities/api-response';

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isAxiosError<ApiResponse<unknown>>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AppError('O servidor demorou para responder.');
    }
    if (!error.response) {
      return new AppError('Sem conexão com o servidor.');
    }
    if (error.response.status >= 500) {
      return new AppError('Erro no servidor. Tente novamente.');
    }
    if (error.response.data?.message) {
      return new AppError(error.response.data.message);
    }
    return new AppError('Não foi possível concluir a operação. Tente novamente.');
  }

  return new AppError('Ocorreu um erro inesperado. Tente novamente.');
}
