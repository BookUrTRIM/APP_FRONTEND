import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProviderDetailService } from './provider-detail.service';
import { ProviderService } from './provider.service';
import type { ProviderModel } from '../models';

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

describe('ProviderDetailService', () => {
  let service: ProviderDetailService;
  let httpMock: HttpTestingController;
  let mockProviderService: { getById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockProviderService = { getById: vi.fn().mockReturnValue(of(makeProvider())) };

    TestBed.configureTestingModule({
      providers: [
        ProviderDetailService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProviderService, useValue: mockProviderService },
      ],
    });
    service = TestBed.inject(ProviderDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('crée le service', () => expect(service).toBeTruthy());

  it('isLoading est true initialement', () => {
    expect(service.isLoading()).toBe(true);
  });

  it('provider est null initialement', () => {
    expect(service.provider()).toBeNull();
  });

  it('averageRating est 0 sans avis', () => {
    expect(service.averageRating()).toBe(0);
  });

  it('hasMore est false si reviews.length === reviewsTotal', () => {
    expect(service.hasMore()).toBe(false);
  });

  describe('load', () => {
    it('charge provider, services et avis', () => {
      service.load(1);

      httpMock.expectOne('/providers/1/services').flush([
        { id: 10, provider_id: 1, name: 'Coupe', description: null, base_price: 30, deposit_amount: null, default_duration: 30, created_at: '', updated_at: '' },
      ]);
      httpMock.expectOne('/providers/1/reviews').flush({
        items: [{ id: 1, appointment_id: 5, rating: 4, comment: 'Top', reviewed_at: '2024-01-01' }],
        total: 3,
      });

      expect(service.provider()?.id).toBe(1);
      expect(service.services().length).toBe(1);
      expect(service.services()[0].name).toBe('Coupe');
      expect(service.reviews().length).toBe(1);
      expect(service.reviewsTotal()).toBe(3);
      expect(service.isLoading()).toBe(false);
    });

    it('gère une erreur', () => {
      mockProviderService.getById.mockReturnValue(throwError(() => ({ status: 404 })));
      service.load(1);

      httpMock.expectOne('/providers/1/services').flush([]);
      httpMock.expectOne('/providers/1/reviews').flush({ items: [], total: 0 });

      expect(service.errorMessage()).toContain('404');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('loadMoreReviews', () => {
    it('ajoute les avis suivants', () => {
      service.reviewsTotal.set(2);
      service.reviews.set([{ id: 1, appointmentId: 5, rating: 4, comment: 'Top', reviewedAt: '2024-01-01' }]);

      service.loadMoreReviews(1);

      httpMock.expectOne('/providers/1/reviews?page=2&limit=20').flush({
        items: [{ id: 2, appointment_id: 6, rating: 5, comment: 'Super', reviewed_at: '2024-01-02' }],
        total: 2,
      });

      expect(service.reviews().length).toBe(2);
      expect(service.reviewsPage()).toBe(2);
      expect(service.isLoadingMore()).toBe(false);
    });
  });
});
