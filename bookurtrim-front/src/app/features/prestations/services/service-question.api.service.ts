import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceQuestionApiContract } from './service-question.api.contract';
import type { ServiceQuestionResponseDTO, ServiceQuestionCreateDTO } from '../dtos';

@Injectable()
export class ServiceQuestionApiService extends ServiceQuestionApiContract {
  private readonly http = inject(HttpClient);

  getByService(serviceId: number): Observable<ServiceQuestionResponseDTO[]> {
    return this.http.get<ServiceQuestionResponseDTO[]>(`/services/${serviceId}/questions`);
  }

  create(serviceId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionResponseDTO> {
    return this.http.post<ServiceQuestionResponseDTO>(`/services/${serviceId}/questions`, dto);
  }

  update(questionId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionResponseDTO> {
    return this.http.put<ServiceQuestionResponseDTO>(`/services/questions/${questionId}`, dto);
  }

  delete(questionId: number): Observable<void> {
    return this.http.delete<void>(`/services/questions/${questionId}`);
  }
}
