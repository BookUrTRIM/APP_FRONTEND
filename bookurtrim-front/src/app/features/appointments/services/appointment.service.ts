import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { AppointmentApiContract } from './appointment.api.contract';
import { mapAppointmentDTOToModel } from '../mapper';
import { AppointmentStatus } from '../enums';
import type { AppointmentResponseDTO } from '../dtos';
import type { AppointmentModel } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly api = inject(AppointmentApiContract);

  // ── Client ──────────────────────────────────────────
  private readonly _clientAppointments = signal<AppointmentModel[]>([]);
  private readonly _clientLoading      = signal(false);

  readonly appointments = computed(() => this._clientAppointments());
  readonly isLoading    = computed(() => this._clientLoading());
  readonly upcoming     = computed(() => this._clientAppointments().filter(a =>
    a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.CONFIRMED
  ));
  readonly past         = computed(() => this._clientAppointments().filter(a =>
    a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CANCELLED
  ));

  // ── Provider ─────────────────────────────────────────
  private readonly _providerAppointments = signal<AppointmentModel[]>([]);
  private readonly _providerLoading      = signal(false);

  readonly providerAppointments = computed(() => this._providerAppointments());
  readonly providerIsLoading    = computed(() => this._providerLoading());
  readonly completed            = computed(() =>
    this._providerAppointments().filter(a => a.status === AppointmentStatus.COMPLETED)
  );

  // ── Méthodes client ──────────────────────────────────
  loadMyAppointments(): Observable<AppointmentModel[]> {
    this._clientLoading.set(true);
    return this.api.listByClient().pipe(
      map(dtos => this._extractList(dtos)),
      tap(list => { this._clientAppointments.set(list); this._clientLoading.set(false); }),
      catchError(err => { this._clientLoading.set(false); return throwError(() => err); })
    );
  }

  cancel(id: number): Observable<AppointmentModel> {
    return this.api.cancel(id).pipe(
      map(mapAppointmentDTOToModel),
      tap(updated =>
        this._clientAppointments.update(list => list.map(a => a.id === id ? updated : a))
      )
    );
  }

  // ── Méthodes provider ────────────────────────────────
  loadProviderAppointments(): Observable<AppointmentModel[]> {
    this._providerLoading.set(true);
    return this.api.listByProvider().pipe(
      map(dtos => this._extractList(dtos)),
      tap(list => { this._providerAppointments.set(list); this._providerLoading.set(false); }),
      catchError(err => { this._providerLoading.set(false); return throwError(() => err); })
    );
  }

  complete(id: number): Observable<AppointmentModel> {
    return this.api.complete(id).pipe(
      map(mapAppointmentDTOToModel),
      tap(updated =>
        this._providerAppointments.update(list => list.map(a => a.id === id ? updated : a))
      )
    );
  }

  // ── Helper ───────────────────────────────────────────
  private _extractList(raw: AppointmentResponseDTO[] | unknown): AppointmentModel[] {
    const list: AppointmentResponseDTO[] = Array.isArray(raw)
      ? raw
      : (raw as { items?: AppointmentResponseDTO[] })?.items ?? [];
    return list.map(mapAppointmentDTOToModel);
  }
}
