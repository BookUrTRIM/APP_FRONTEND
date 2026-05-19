import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { AppointmentApiContract } from './appointment.api.contract';
import { mapAppointmentDTOToModel } from '../mapper';
import { AppointmentStatus } from '../enums';
import type { AppointmentModel } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly api = inject(AppointmentApiContract);

  private readonly _appointments = signal<AppointmentModel[]>([]);
  private readonly _isLoading    = signal(false);

  readonly appointments = computed(() => this._appointments());
  readonly isLoading    = computed(() => this._isLoading());

  readonly upcoming = computed(() =>
    this._appointments().filter(a =>
      a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.CONFIRMED
    )
  );

  readonly past = computed(() =>
    this._appointments().filter(a =>
      a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CANCELLED
    )
  );

  loadMyAppointments(): Observable<AppointmentModel[]> {
    this._isLoading.set(true);
    return this.api.listByClient().pipe(
      map(dtos => {
        const list = Array.isArray(dtos) ? dtos : (dtos as { items?: typeof dtos })?.items ?? [];
        return list.map(mapAppointmentDTOToModel);
      }),
      tap(list => {
        this._appointments.set(list);
        this._isLoading.set(false);
      }),
      catchError(err => {
        this._isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  cancel(id: number): Observable<AppointmentModel> {
    return this.api.cancel(id).pipe(
      map(mapAppointmentDTOToModel),
      tap(updated =>
        this._appointments.update(list =>
          list.map(a => a.id === id ? updated : a)
        )
      )
    );
  }
}
