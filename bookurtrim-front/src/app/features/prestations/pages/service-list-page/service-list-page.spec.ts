import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServiceListPage } from './service-list-page';
import { ServiceApiContract } from '../../services/service.api.contract';
import { ServiceQuestionApiContract } from '../../services/service-question.api.contract';
import type { ServiceResponseDTO } from '../../dtos';

const makeServiceDTO = (): ServiceResponseDTO => ({
  id: 1, provider_id: 1, name: 'Coupe', description: null,
  base_price: 20, default_duration: 30, created_at: '', updated_at: '',
});

class MockServiceApi extends ServiceApiContract {
  create        = vi.fn();
  update        = vi.fn();
  delete        = vi.fn();
  getById       = vi.fn();
  listByProvider = vi.fn().mockReturnValue(of([makeServiceDTO()]));
}

class MockQuestionApi extends ServiceQuestionApiContract {
  getByService = vi.fn().mockReturnValue(of([]));
  create       = vi.fn();
  update       = vi.fn();
  delete       = vi.fn();
}

describe('ServiceListPage — logique', () => {
  let component: ServiceListPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ServiceApiContract, useClass: MockServiceApi },
        { provide: ServiceQuestionApiContract, useClass: MockQuestionApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ServiceListPage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());
});
