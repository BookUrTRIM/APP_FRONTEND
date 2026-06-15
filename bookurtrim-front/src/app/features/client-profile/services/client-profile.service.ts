import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { ClientProfileApiContract } from './client-profile.api.contract';
import { mapClientProfileDTOToModel } from '../mapper';
import type { ClientProfileUpdateDTO } from '../dtos';
import type { ClientProfileModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientProfileService {
  private readonly api = inject(ClientProfileApiContract);

  private readonly _profile = signal<ClientProfileModel | null>(null);
  private readonly _isLoading = signal(false);

  readonly profile = computed(() => this._profile());
  readonly isLoading = computed(() => this._isLoading());

  loadMe(): Observable<ClientProfileModel> {
    this._isLoading.set(true);
    return this.api.getMe().pipe(
      map(mapClientProfileDTOToModel),
      tap(profile => {
        this._profile.set(profile);
        this._isLoading.set(false);
      }),
      catchError(err => {
        this._isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  update(dto: ClientProfileUpdateDTO): Observable<ClientProfileModel> {
    return this.api.update(dto).pipe(
      map(mapClientProfileDTOToModel),
      tap(profile => this._profile.set(profile))
    );
  }
}
