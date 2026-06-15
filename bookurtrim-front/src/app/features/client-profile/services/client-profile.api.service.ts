import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProfileApiContract } from './client-profile.api.contract';
import type { ClientProfileResponseDTO, ClientProfileUpdateDTO } from '../dtos';

@Injectable()
export class ClientProfileApiService extends ClientProfileApiContract {
  private readonly http = inject(HttpClient);

  getMe(): Observable<ClientProfileResponseDTO> {
    return this.http.get<ClientProfileResponseDTO>('/clients/me');
  }

  update(dto: ClientProfileUpdateDTO): Observable<ClientProfileResponseDTO> {
    return this.http.patch<ClientProfileResponseDTO>('/clients/me', dto);
  }
}
