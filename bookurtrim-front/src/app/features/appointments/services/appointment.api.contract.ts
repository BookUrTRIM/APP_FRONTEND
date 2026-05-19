import { Observable } from 'rxjs';
import type { AppointmentCreateDTO, AppointmentResponseDTO } from '../dtos';

export abstract class AppointmentApiContract {
  abstract create(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO>;
  abstract listByClient(status?: string): Observable<AppointmentResponseDTO[]>;
  abstract listByProvider(status?: string): Observable<AppointmentResponseDTO[]>;
  abstract cancel(id: number): Observable<AppointmentResponseDTO>;
  abstract complete(id: number): Observable<AppointmentResponseDTO>;
}
