import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, tap, catchError, throwError } from 'rxjs';
import { ServiceApiContract } from './service.api.contract';
import { mapServiceDTOToModel } from '../mapper';
import type { ServiceCreateDTO, ServiceUpdateDTO } from '../dtos';
import type { ServiceModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly api = inject(ServiceApiContract);
  private readonly http = inject(HttpClient);

  private readonly _services = signal<ServiceModel[]>([]);
  private readonly _isLoading = signal(false);

  readonly services = computed(() => this._services());
  readonly isLoading = computed(() => this._isLoading());

  private _getProviderId(): Observable<number> {
    return this.http.get<{ id: number }>('/providers/me').pipe(
      map(p => p.id)
    );
  }

  loadMyServices(): Observable<ServiceModel[]> {
    this._isLoading.set(true);
    return this._getProviderId().pipe(
      switchMap(id => this.api.listByProvider(id)),
      tap(raw => console.log('[ServiceService] raw response from listByProvider:', raw)),
      map(dtos => {
        const list = Array.isArray(dtos) ? dtos : (dtos as { items?: typeof dtos })?.items ?? [];
        return list.map(mapServiceDTOToModel);
      }),
      tap(services => {
        this._services.set(services);
        this._isLoading.set(false);
      }),
      catchError(err => {
        this._isLoading.set(false);
        console.error('[ServiceService] loadMyServices failed', err.status, err.message, err);
        return throwError(() => err);
      })
    );
  }

  create(dto: ServiceCreateDTO): Observable<ServiceModel> {
    return this.api.create(dto).pipe(
      map(mapServiceDTOToModel),
      tap(service => this._services.update(list => [...list, service]))
    );
  }

  update(id: number, dto: ServiceUpdateDTO): Observable<ServiceModel> {
    return this.api.update(id, dto).pipe(
      map(mapServiceDTOToModel),
      tap(updated =>
        this._services.update(list => list.map(s => s.id === id ? updated : s))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete(id).pipe(
      tap(() => this._services.update(list => list.filter(s => s.id !== id)))
    );
  }

  getById(id: number): Observable<ServiceModel> {
    return this.api.getById(id).pipe(map(mapServiceDTOToModel));
  }
}
