import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderBookPage } from './provider-book-page';
import { ProviderDetailService } from '../../services/provider-detail.service';
import type { ServiceModel } from '../../../prestations/models';

const makeService = (overrides: Partial<ServiceModel> = {}): ServiceModel => ({
  id: 10,
  providerId: 1,
  name: 'Coupe',
  description: null,
  basePrice: 30,
  depositAmount: null,
  defaultDuration: 30,
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('ProviderBookPage — logique', () => {
  let component: ProviderBookPage;
  let providerDetail: ProviderDetailService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderBookPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProviderDetailService,
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { paramMap: { get: () => '1' } } } },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderBookPage);
    component = fixture.componentInstance;
    providerDetail = TestBed.inject(ProviderDetailService);
    router = TestBed.inject(Router);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('services est vide initialement', () => {
    expect(component.services().length).toBe(0);
  });

  it('book navigue vers la page de réservation avec le serviceId', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    providerDetail.services.set([makeService()]);

    component.book(makeService());

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/providers', 1, 'book'],
      { queryParams: { serviceId: 10 } }
    );
  });
});
