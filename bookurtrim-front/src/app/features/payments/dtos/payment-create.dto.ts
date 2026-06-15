import type { PaymentType } from '../enums';

export interface PaymentCreateDTO {
  appointment_id: number;
  amount: number;
  currency?: string;
  payment_type: PaymentType;
}
