import type { PaymentResponseDTO } from '../dtos';
import type { PaymentModel } from '../models';
import { PaymentType, PaymentStatus } from '../enums';

export function mapPaymentDTOToModel(dto: PaymentResponseDTO): PaymentModel {
  return {
    id:                     dto.id,
    appointmentId:          dto.appointment_id,
    amount:                 dto.amount,
    currency:               dto.currency,
    paymentType:            dto.payment_type as PaymentType,
    status:                 dto.status as PaymentStatus,
    paidAt:                 dto.paid_at,
    stripePaymentIntentId:  dto.stripe_payment_intent_id,
    stripeChargeId:         dto.stripe_charge_id,
    stripeMetadata:         dto.stripe_metadata,
  };
}
