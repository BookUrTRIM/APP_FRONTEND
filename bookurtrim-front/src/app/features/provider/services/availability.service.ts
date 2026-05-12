import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailabilityCreateDTO, AvailabilityResponseDTO } from '../../../core/models/availability.models';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private http = inject(HttpClient);

  getAvailabilities(providerId: number, date?: string): Observable<AvailabilityResponseDTO[]> {
    let url = `/providers/${providerId}/availabilities`;
    if (date) url += `?date=${date}`;
    return this.http.get<AvailabilityResponseDTO[]>(url);
  }

  createBulkAvailabilities(dtos: AvailabilityCreateDTO[]): Observable<AvailabilityResponseDTO[]> {
    return this.http.post<AvailabilityResponseDTO[]>('/availabilities/bulk', dtos);
  }

  deleteAvailability(id: number): Observable<void> {
    return this.http.delete<void>(`/availabilities/${id}`);
  }
}
