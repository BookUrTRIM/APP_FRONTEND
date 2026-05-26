import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, interval, switchMap, takeWhile, map, tap, catchError, throwError } from 'rxjs';
import { PaymentApiContract } from './payment.api.contract';
import { mapPaymentDTOToModel } from '../mapper';
import { PaymentStatus } from '../enums';
import type { PaymentCreateDTO, PaymentIntentResponseDTO } from '../dtos';
import type { PaymentModel } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly api = inject(PaymentApiContract);

  private readonly _payments = signal<PaymentModel[]>([]);
  private readonly _loading  = signal(false);

  readonly payments  = computed(() => this._payments());
  readonly isLoading = computed(() => this._loading());
  readonly pending   = computed(() => this._payments().filter(p => p.status === PaymentStatus.PENDING));
  readonly validated = computed(() => this._payments().filter(p => p.status === PaymentStatus.VALIDATED));

  loadByAppointment(appointmentId: number): Observable<PaymentModel[]> {
    this._loading.set(true);
    return this.api.listByAppointment(appointmentId).pipe(
      map(dtos => dtos.map(mapPaymentDTOToModel)),
      tap(list => { this._payments.set(list); this._loading.set(false); }),
      catchError(err => { this._loading.set(false); return throwError(() => err); })
    );
  }

  initiate(dto: PaymentCreateDTO): Observable<PaymentModel> {
    return this.api.create(dto).pipe(
      map(mapPaymentDTOToModel),
      tap(payment => this._payments.update(list => [...list, payment]))
    );
  }

  prepare(paymentId: number): Observable<PaymentIntentResponseDTO> {
    return this.api.prepare(paymentId);
  }

  getById(paymentId: number): Observable<PaymentModel> {
    return this.api.getById(paymentId).pipe(map(mapPaymentDTOToModel));
  }

  refundByAppointment(appointmentId: number): Observable<PaymentModel> {
    return this.api.refundByAppointment(appointmentId).pipe(
      map(mapPaymentDTOToModel),
      tap(refunded =>
        this._payments.update(list => list.map(p => p.appointmentId === appointmentId ? refunded : p))
      )
    );
  }

  pollUntilResolved(paymentId: number): Observable<PaymentModel> {
    return interval(1500).pipe(
      switchMap(() => this.api.getById(paymentId)),
      map(mapPaymentDTOToModel),
      tap(payment => {
        this._payments.update(list =>
          list.map(p => p.id === paymentId ? payment : p)
        );
      }),
      takeWhile(p => p.status === PaymentStatus.PENDING, true)
    );
  }
}
