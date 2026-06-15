import { Observable } from 'rxjs';
import type { LoginDTO, SignupDTO, AuthResponseDTO } from '../dtos';

export abstract class AuthApiContract {
  abstract login(dto: LoginDTO): Observable<AuthResponseDTO>;
  abstract signup(dto: SignupDTO): Observable<void>;
  abstract verifyEmail(token: string): Observable<{ message: string }>;
}
