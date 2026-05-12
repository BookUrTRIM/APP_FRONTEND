import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthApiContract } from './auth.api.contract';
import type { LoginDTO, SignupDTO, AuthResponseDTO } from '../dtos';

@Injectable()
export class AuthApiService extends AuthApiContract {
  private readonly http = inject(HttpClient);

  login(dto: LoginDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>('/auth/login', dto);
  }

  signup(dto: SignupDTO): Observable<void> {
    return this.http.post<void>('/auth/signup', dto);
  }
}
