import { Observable } from 'rxjs';
import type { PaymentCreateDTO, PaymentResponseDTO, PaymentIntentResponseDTO } from '../dtos';

export abstract class PaymentApiContract {
  abstract create(dto: PaymentCreateDTO): Observable<PaymentResponseDTO>;
  abstract getById(paymentId: number): Observable<PaymentResponseDTO>;
  abstract listByAppointment(appointmentId: number): Observable<PaymentResponseDTO[]>;
  abstract prepare(paymentId: number): Observable<PaymentIntentResponseDTO>;
}
