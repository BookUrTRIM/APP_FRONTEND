import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { ProviderApiContract } from './provider.api.contract';
import { mapProviderDTOToModel } from '../mapper';
import type { ProviderModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly api = inject(ProviderApiContract);

  private readonly _providers = signal<ProviderModel[]>([]);
  private readonly _isLoading = signal(false);

  readonly providers = computed(() => this._providers());
  readonly isLoading = computed(() => this._isLoading());

  loadAll(): Observable<ProviderModel[]> {
    this._isLoading.set(true);
    return this.api.list().pipe(
      map(raw => {
        const list = Array.isArray(raw) ? raw : (raw as { items?: typeof raw })?.items ?? [];
        return list.map(mapProviderDTOToModel);
      }),
      tap(providers => {
        this._providers.set(providers);
        this._isLoading.set(false);
      }),
      catchError(err => {
        this._isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<ProviderModel> {
    return this.api.getById(id).pipe(map(mapProviderDTOToModel));
  }
}
