import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderAboutPage } from './provider-about-page';
import { ProviderDetailService } from '../../services/provider-detail.service';
import type { ProviderModel } from '../../models';

const makeProvider = (overrides: Partial<ProviderModel> = {}): ProviderModel => ({
  id: 1,
  userAccountId: 2,
  firstName: 'Marie',
  lastName: 'Dubois',
  phone: null,
  businessName: null,
  address: null,
  stripeAccountId: null,
  isSingleTenant: false,
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('ProviderAboutPage — logique', () => {
  let component: ProviderAboutPage;
  let providerDetail: ProviderDetailService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderAboutPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProviderDetailService,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderAboutPage);
    component = fixture.componentInstance;
    providerDetail = TestBed.inject(ProviderDetailService);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('mapUrl est null sans adresse', () => {
    expect(component.mapUrl()).toBeNull();
  });

  it('mapUrl contient l\'adresse encodée', () => {
    providerDetail.provider.set(makeProvider({ address: '12 rue de la Paix, Paris' }));
    expect(component.mapUrl()).toContain(encodeURIComponent('12 rue de la Paix, Paris'));
  });
});
