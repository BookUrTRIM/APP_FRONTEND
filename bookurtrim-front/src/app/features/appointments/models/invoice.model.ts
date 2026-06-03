export interface InvoiceModel {
  id: number;
  appointmentId: number;
  totalAmount: number;
  issuedAt: string;
  pdfUrl: string | null;
}
