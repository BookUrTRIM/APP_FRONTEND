export interface ReceiptResponseDTO {
  id: number;
  payment_id: number;
  appointment_id: number;
  amount: number;
  currency: string;
  payment_type: string;
  issued_at: string;
  stripe_receipt_url: string;
}
