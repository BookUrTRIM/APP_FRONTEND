import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ServiceQuestionService } from './service-question.service';
import { ServiceQuestionApiContract } from './service-question.api.contract';
import type { ServiceQuestionResponseDTO } from '../dtos';

const makeDTO = (overrides: Partial<ServiceQuestionResponseDTO> = {}): ServiceQuestionResponseDTO => ({
  id: 1, service_id: 10, question: 'Type de cheveux ?',
  options: [{ label: 'Court', extra_minutes: 0 }, { label: 'Long', extra_minutes: 15 }],
  order: 1,
  ...overrides,
});

class MockApi extends ServiceQuestionApiContract {
  getByService = vi.fn().mockReturnValue(of([makeDTO()]));
  create       = vi.fn().mockReturnValue(of(makeDTO({ id: 2, question: 'Nouvelle question' })));
  update       = vi.fn().mockReturnValue(of(makeDTO({ question: 'Question modifiée' })));
  delete       = vi.fn().mockReturnValue(of(undefined));
}

describe('ServiceQuestionService', () => {
  let service: ServiceQuestionService;
  let mockApi: MockApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceQuestionService,
        { provide: ServiceQuestionApiContract, useClass: MockApi },
      ],
    });
    service = TestBed.inject(ServiceQuestionService);
    mockApi = TestBed.inject(ServiceQuestionApiContract) as MockApi;
  });

  it('crée le service', () => expect(service).toBeTruthy());

  it('questions est vide initialement', () => {
    expect(service.questions().length).toBe(0);
  });

  describe('loadByService', () => {
    it('charge et stocke les questions', async () => {
      await firstValueFrom(service.loadByService(10));
      expect(service.questions().length).toBe(1);
      expect(service.questions()[0].question).toBe('Type de cheveux ?');
    });

    it('mappe les options correctement', async () => {
      await firstValueFrom(service.loadByService(10));
      expect(service.questions()[0].options[0].extraMinutes).toBe(0);
      expect(service.questions()[0].options[1].extraMinutes).toBe(15);
    });
  });

  describe('create', () => {
    it('ajoute la question à la liste', async () => {
      await firstValueFrom(service.loadByService(10));
      await firstValueFrom(service.create(10, { question: 'Nouvelle question', options: [] }));
      expect(service.questions().length).toBe(2);
    });
  });

  describe('update', () => {
    it('met à jour la question dans la liste', async () => {
      await firstValueFrom(service.loadByService(10));
      await firstValueFrom(service.update(1, { question: 'Question modifiée', options: [] }));
      expect(service.questions()[0].question).toBe('Question modifiée');
    });
  });

  describe('delete', () => {
    it('supprime la question de la liste', async () => {
      await firstValueFrom(service.loadByService(10));
      await firstValueFrom(service.delete(1));
      expect(service.questions().length).toBe(0);
    });
  });
});
