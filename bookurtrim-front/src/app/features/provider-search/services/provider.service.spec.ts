import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ProviderService } from './provider.service';
import { ProviderApiContract } from './provider.api.contract';
import type { ProviderResponseDTO } from '../dtos';

const makeDTO = (overrides: Partial<ProviderResponseDTO> = {}): ProviderResponseDTO => ({
  id: 1, user_account_id: 2,
  first_name: 'Marie', last_name: 'Dubois',
  phone: null, business_name: null, address: null, stripe_account_id: null,
  is_single_tenant: false,
  created_at: '', updated_at: '',
  ...overrides,
});

class MockApi extends ProviderApiContract {
  list    = vi.fn().mockReturnValue(of([makeDTO(), makeDTO({ id: 2 })]));
  getById = vi.fn().mockReturnValue(of(makeDTO()));
}

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProviderService,
        { provide: ProviderApiContract, useClass: MockApi },
      ],
    });
    service = TestBed.inject(ProviderService);
  });

  it('crée le service', () => expect(service).toBeTruthy());

  it('isLoading est false initialement', () => {
    expect(service.isLoading()).toBe(false);
  });

  describe('loadAll', () => {
    it('charge et stocke les providers', async () => {
      await firstValueFrom(service.loadAll());
      expect(service.providers().length).toBe(2);
    });

    it('mappe les champs correctement', async () => {
      await firstValueFrom(service.loadAll());
      expect(service.providers()[0].firstName).toBe('Marie');
    });

    it('gère une réponse paginée', async () => {
      const mockApi = TestBed.inject(ProviderApiContract) as MockApi;
      mockApi.list = vi.fn().mockReturnValue(
        of({ items: [makeDTO()], total: 1, page: 1, limit: 20 })
      );
      await firstValueFrom(service.loadAll());
      expect(service.providers().length).toBe(1);
    });
  });

  describe('getById', () => {
    it('retourne un provider mappé', async () => {
      const provider = await firstValueFrom(service.getById(1));
      expect(provider.id).toBe(1);
      expect(provider.firstName).toBe('Marie');
    });
  });
});
