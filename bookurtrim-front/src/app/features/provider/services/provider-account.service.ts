import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProviderAccountApiContract } from './provider-account.api.contract';
import type { ProviderAccountUpdateDTO } from '../dtos';
import type { ProviderAccountModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ProviderAccountService {
  private readonly api = inject(ProviderAccountApiContract);

  private readonly _provider = signal<ProviderAccountModel | null>(null);

  readonly provider = computed(() => this._provider());

  load(): Observable<ProviderAccountModel> {
    return this.api.getMe().pipe(
      tap(provider => this._provider.set(provider))
    );
  }

  update(dto: ProviderAccountUpdateDTO): Observable<ProviderAccountModel> {
    return this.api.updateMe(dto).pipe(
      tap(provider => this._provider.set(provider))
    );
  }
}
