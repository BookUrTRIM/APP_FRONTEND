import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ServiceQuestionApiContract } from './service-question.api.contract';
import { mapServiceQuestionDTOToModel } from '../mapper';
import type { ServiceQuestionCreateDTO } from '../dtos';
import type { ServiceQuestionModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceQuestionService {
  private readonly api = inject(ServiceQuestionApiContract);

  private readonly _questions = signal<ServiceQuestionModel[]>([]);
  readonly questions = this._questions.asReadonly();

  loadByService(serviceId: number): Observable<ServiceQuestionModel[]> {
    return this.api.getByService(serviceId).pipe(
      map(dtos => dtos.map(mapServiceQuestionDTOToModel)),
      tap(list => this._questions.set(list))
    );
  }

  create(serviceId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionModel> {
    return this.api.create(serviceId, dto).pipe(
      map(mapServiceQuestionDTOToModel),
      tap(q => this._questions.update(list => [...list, q].sort((a, b) => a.order - b.order)))
    );
  }

  update(questionId: number, dto: ServiceQuestionCreateDTO): Observable<ServiceQuestionModel> {
    return this.api.update(questionId, dto).pipe(
      map(mapServiceQuestionDTOToModel),
      tap(updated => this._questions.update(list => list.map(q => q.id === questionId ? updated : q)))
    );
  }

  delete(questionId: number): Observable<void> {
    return this.api.delete(questionId).pipe(
      tap(() => this._questions.update(list => list.filter(q => q.id !== questionId)))
    );
  }
}
