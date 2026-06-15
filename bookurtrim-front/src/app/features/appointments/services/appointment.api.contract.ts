import { Observable } from 'rxjs';
import type { AppointmentCreateDTO, AppointmentResponseDTO } from '../dtos';
import type { InvoiceResponseDTO } from '../dtos/invoice.dto';
import type { ReceiptResponseDTO } from '../dtos/receipt.dto';

export abstract class AppointmentApiContract {
  abstract create(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO>;
  abstract listByClient(status?: string): Observable<AppointmentResponseDTO[]>;
  abstract listByProvider(status?: string): Observable<AppointmentResponseDTO[]>;
  abstract cancelByClient(id: number): Observable<AppointmentResponseDTO>;
  abstract cancelByProvider(id: number): Observable<AppointmentResponseDTO>;
  abstract complete(id: number): Observable<AppointmentResponseDTO>;
  abstract getInvoice(id: number): Observable<InvoiceResponseDTO>;
  abstract getReceipts(id: number): Observable<ReceiptResponseDTO[]>;
}
