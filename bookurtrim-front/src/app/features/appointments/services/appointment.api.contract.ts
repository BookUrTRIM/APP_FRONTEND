import { Observable } from 'rxjs';
import type { AppointmentCreateDTO, AppointmentResponseDTO } from '../dtos';

export abstract class AppointmentApiContract {
  abstract create(dto: AppointmentCreateDTO): Observable<AppointmentResponseDTO>;
}
