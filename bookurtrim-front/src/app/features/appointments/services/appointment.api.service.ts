import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentApiContract } from './appointment.api.contract';
import type { AppointmentCreateDTO, AppointmentResponseDTO } from '../dtos';

@Injectable()
export class AppointmentApiService extends AppointmentApiContract {
  private readonly http = inject(HttpClient);

  create(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>('/appointments/', dto);
  }
}
