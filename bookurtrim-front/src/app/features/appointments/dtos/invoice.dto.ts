export interface InvoiceResponseDTO {
  id: number;
  appointment_id: number;
  total_amount: number;
  issued_at: string;
  pdf_url: string | null;
}
