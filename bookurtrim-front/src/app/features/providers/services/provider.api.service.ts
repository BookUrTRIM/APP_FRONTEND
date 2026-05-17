import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderApiContract } from './provider.api.contract';
import type { ProviderResponseDTO } from '../dtos';

@Injectable()
export class ProviderApiService extends ProviderApiContract {
  private readonly http = inject(HttpClient);

  list(): Observable<ProviderResponseDTO[]> {
    return this.http.get<ProviderResponseDTO[]>('/providers/');
  }

  getById(id: number): Observable<ProviderResponseDTO> {
    return this.http.get<ProviderResponseDTO>(`/providers/${id}`);
  }
}
