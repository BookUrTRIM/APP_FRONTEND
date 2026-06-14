import { Observable } from 'rxjs';
import type { ServiceCreateDTO, ServiceUpdateDTO, ServiceResponseDTO } from '../dtos';

export abstract class ServiceApiContract {
  abstract create(dto: ServiceCreateDTO): Observable<ServiceResponseDTO>;
  abstract update(id: number, dto: ServiceUpdateDTO): Observable<ServiceResponseDTO>;
  abstract delete(id: number): Observable<void>;
  abstract getById(id: number): Observable<ServiceResponseDTO>;
  abstract listByProvider(providerId: number): Observable<ServiceResponseDTO[]>;
}
