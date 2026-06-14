import { Observable } from 'rxjs';
import type { ServiceQuestionResponseDTO, ServiceQuestionCreateDTO } from '../dtos';

export abstract class ServiceQuestionApiContract {
  abstract getByService(serviceId: number): Observable<ServiceQuestionResponseDTO[]>;
  abstract create(serviceId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionResponseDTO>;
  abstract update(questionId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionResponseDTO>;
  abstract delete(questionId: number): Observable<void>;
}
