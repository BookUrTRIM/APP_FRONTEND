import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProviderAccountService } from './provider-account.service';
import { ProviderAccountApiContract } from './provider-account.api.contract';
import type { ProviderAccountModel } from '../models';

const makeProvider = (overrides: Partial<ProviderAccountModel> = {}): ProviderAccountModel => ({
  id: 1,
  user_account_id: 1,
  first_name: 'Jeanne',
  last_name: 'Dupont',
  phone: null,
  business_name: null,
  address: null,
  stripe_account_id: null,
  google_calendar_token_enc: null,
  created_at: '',
  updated_at: '',
  ...overrides,
});

describe('ProviderAccountService', () => {
  let service: ProviderAccountService;
  let mockApi: { getMe: ReturnType<typeof vi.fn>; updateMe: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockApi = {
      getMe: vi.fn(() => of(makeProvider())),
      updateMe: vi.fn(() => of(makeProvider({ business_name: 'Salon Jeanne' }))),
    };

    TestBed.configureTestingModule({
      providers: [
        ProviderAccountService,
        { provide: ProviderAccountApiContract, useValue: mockApi },
      ],
    });
    service = TestBed.inject(ProviderAccountService);
  });

  it('crée le service', () => expect(service).toBeTruthy());

  it('provider est null avant le premier load()', () => {
    expect(service.provider()).toBeNull();
  });

  it('load() met à jour le signal provider', () => {
    service.load().subscribe();
    expect(service.provider()).toEqual(makeProvider());
  });

  it('update() met à jour le signal provider', () => {
    service.update({ business_name: 'Salon Jeanne' }).subscribe();
    expect(service.provider()?.business_name).toBe('Salon Jeanne');
  });
});
