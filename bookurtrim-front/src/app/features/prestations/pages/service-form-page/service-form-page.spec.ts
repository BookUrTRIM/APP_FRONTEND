import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServiceFormPage } from './service-form-page';
import { ServiceApiContract } from '../../services/service.api.contract';
import { ServiceQuestionApiContract } from '../../services/service-question.api.contract';
import type { ServiceResponseDTO } from '../../dtos';

const makeServiceDTO = (): ServiceResponseDTO => ({
  id: 1, provider_id: 1, name: 'Coupe', description: null,
  base_price: 20, default_duration: 30, created_at: '', updated_at: '',
});

class MockServiceApi extends ServiceApiContract {
  create         = vi.fn().mockReturnValue(of(makeServiceDTO()));
  update         = vi.fn().mockReturnValue(of(makeServiceDTO()));
  delete         = vi.fn();
  getById        = vi.fn().mockReturnValue(of(makeServiceDTO()));
  listByProvider = vi.fn().mockReturnValue(of([]));
}

class MockQuestionApi extends ServiceQuestionApiContract {
  getByService = vi.fn().mockReturnValue(of([]));
  create       = vi.fn();
  update       = vi.fn();
  delete       = vi.fn();
}

function createPage(serviceId: string | null) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ServiceFormPage],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: ServiceApiContract, useClass: MockServiceApi },
      { provide: ServiceQuestionApiContract, useClass: MockQuestionApi },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => serviceId } } } },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(ServiceFormPage);
  return fixture.componentInstance;
}

describe('ServiceFormPage — logique', () => {
  it('crée le composant en mode création', () => {
    const component = createPage(null);
    expect(component).toBeTruthy();
    expect(component.isEdit).toBe(false);
  });

  it('crée le composant en mode édition', () => {
    const component = createPage('1');
    expect(component).toBeTruthy();
    expect(component.isEdit).toBe(true);
    expect(component.serviceId).toBe(1);
  });
});
