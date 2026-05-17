import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceApiContract } from './service.api.contract';
import type { ServiceCreateDTO, ServiceUpdateDTO, ServiceResponseDTO } from '../dtos';

@Injectable()
export class ServiceApiService extends ServiceApiContract {
  private readonly http = inject(HttpClient);

  create(dto: ServiceCreateDTO): Observable<ServiceResponseDTO> {
    return this.http.post<ServiceResponseDTO>('/services/', dto);
  }

  update(id: number, dto: ServiceUpdateDTO): Observable<ServiceResponseDTO> {
    return this.http.patch<ServiceResponseDTO>(`/services/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/services/${id}`);
  }

  getById(id: number): Observable<ServiceResponseDTO> {
    return this.http.get<ServiceResponseDTO>(`/services/${id}`);
  }

  listByProvider(providerId: number): Observable<ServiceResponseDTO[]> {
    return this.http.get<ServiceResponseDTO[]>(`/providers/${providerId}/services`);
  }
}
