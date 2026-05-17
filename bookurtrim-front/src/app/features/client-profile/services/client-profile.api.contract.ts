import { Observable } from 'rxjs';
import type { ClientProfileResponseDTO, ClientProfileUpdateDTO } from '../dtos';

export abstract class ClientProfileApiContract {
  abstract getMe(): Observable<ClientProfileResponseDTO>;
  abstract update(dto: ClientProfileUpdateDTO): Observable<ClientProfileResponseDTO>;
}
