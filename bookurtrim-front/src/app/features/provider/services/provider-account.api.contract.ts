import { Observable } from 'rxjs';
import type { ProviderAccountUpdateDTO } from '../dtos';
import type { ProviderAccountModel } from '../models';

export abstract class ProviderAccountApiContract {
  abstract getMe(): Observable<ProviderAccountModel>;
  abstract updateMe(dto: ProviderAccountUpdateDTO): Observable<ProviderAccountModel>;
}
