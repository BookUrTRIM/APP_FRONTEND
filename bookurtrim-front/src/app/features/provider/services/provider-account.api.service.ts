import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderAccountApiContract } from './provider-account.api.contract';
import type { ProviderAccountUpdateDTO } from '../dtos';
import type { ProviderAccountModel } from '../models';

@Injectable()
export class ProviderAccountApiService extends ProviderAccountApiContract {
  private readonly http = inject(HttpClient);

  getMe(): Observable<ProviderAccountModel> {
    return this.http.get<ProviderAccountModel>('/providers/me');
  }

  updateMe(dto: ProviderAccountUpdateDTO): Observable<ProviderAccountModel> {
    return this.http.patch<ProviderAccountModel>('/providers/me', dto);
  }
}
