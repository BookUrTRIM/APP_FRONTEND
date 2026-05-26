import type { PaymentStatus, PaymentType } from '../enums';

export interface PaymentModel {
  id: number;
  appointmentId: number;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  status: PaymentStatus;
  paidAt: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  stripeMetadata: Record<string, unknown> | null;
}
