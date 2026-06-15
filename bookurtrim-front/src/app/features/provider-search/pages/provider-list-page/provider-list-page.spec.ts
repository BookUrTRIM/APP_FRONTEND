import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProviderListPage } from './provider-list-page';
import { ProviderService } from '../../services/provider.service';
import { ProviderApiContract } from '../../services/provider.api.contract';
import type { ProviderResponseDTO } from '../../dtos';

const makeDTO = (): ProviderResponseDTO => ({
  id: 1, user_account_id: 2, first_name: 'Marie', last_name: 'Dubois',
  phone: null, business_name: null, address: null, stripe_account_id: null,
  is_single_tenant: false,
  created_at: '', updated_at: '',
});

class MockApi extends ProviderApiContract {
  list    = vi.fn().mockReturnValue(of([makeDTO()]));
  getById = vi.fn().mockReturnValue(of(makeDTO()));
}

describe('ProviderListPage — logique', () => {
  let component: ProviderListPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProviderService,
        { provide: ProviderApiContract, useClass: MockApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderListPage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());
});
