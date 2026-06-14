import { Observable } from 'rxjs';
import type { ProviderResponseDTO } from '../dtos';

export abstract class ProviderApiContract {
  abstract list(): Observable<ProviderResponseDTO[]>;
  abstract getById(id: number): Observable<ProviderResponseDTO>;
}
