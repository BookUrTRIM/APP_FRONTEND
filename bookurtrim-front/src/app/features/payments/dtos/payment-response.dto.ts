export interface PaymentResponseDTO {
  id: number;
  appointment_id: number;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  paid_at: string | null;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  stripe_metadata: Record<string, unknown> | null;
  stripe_receipt_url: string | null;
}
