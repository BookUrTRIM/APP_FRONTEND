import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentApiContract } from './appointment.api.contract';
import type { AppointmentCreateDTO, AppointmentResponseDTO } from '../dtos';

@Injectable()
export class AppointmentApiService extends AppointmentApiContract {
  private readonly http = inject(HttpClient);

  create(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>('/appointments/', dto);
  }

  listByClient(status?: string): Observable<AppointmentResponseDTO[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<AppointmentResponseDTO[]>('/appointments/client', { params });
  }

  listByProvider(status?: string): Observable<AppointmentResponseDTO[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<AppointmentResponseDTO[]>('/appointments/provider', { params });
  }

  cancelByClient(id: number): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>(`/appointments/${id}/cancel-by-client`, {});
  }

  cancelByProvider(id: number): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>(`/appointments/${id}/cancel-by-provider`, {});
  }

  complete(id: number): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>(`/appointments/${id}/complete`, {});
  }
}
