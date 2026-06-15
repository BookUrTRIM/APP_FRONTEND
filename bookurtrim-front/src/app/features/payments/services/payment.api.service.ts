import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentApiContract } from './payment.api.contract';
import type { PaymentCreateDTO, PaymentResponseDTO, PaymentIntentResponseDTO } from '../dtos';

@Injectable()
export class PaymentApiService extends PaymentApiContract {
  private readonly http = inject(HttpClient);

  create(dto: PaymentCreateDTO): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>('/payments', dto);
  }

  getById(paymentId: number): Observable<PaymentResponseDTO> {
    return this.http.get<PaymentResponseDTO>(`/payments/${paymentId}`);
  }

  listByAppointment(appointmentId: number): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`/payments/appointment/${appointmentId}`);
  }

  prepare(paymentId: number): Observable<PaymentIntentResponseDTO> {
    return this.http.post<PaymentIntentResponseDTO>(`/payments/${paymentId}/prepare`, {});
  }

  refundByAppointment(appointmentId: number): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>(`/payments/appointment/${appointmentId}/refund`, {});
  }
}
