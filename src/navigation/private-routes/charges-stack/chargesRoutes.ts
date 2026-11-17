import type { Charge, ChargeFailure } from '@/types/entities/charge';

export type ChargesStackRoutes = {
  charges: { notice?: string } | undefined;
  chargeReview: { charge: Charge };
  chargePassword: { failure: ChargeFailure };
  chargeManual: { failure: ChargeFailure };
};
