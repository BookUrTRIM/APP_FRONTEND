import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderDetailPage } from './provider-detail-page';

describe('ProviderDetailPage — logique', () => {
  let component: ProviderDetailPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderDetailPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderDetailPage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('isLoading est true initialement', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('provider est null initialement', () => {
    expect(component.provider()).toBeNull();
  });

  it('services est vide initialement', () => {
    expect(component.services().length).toBe(0);
  });

  it('reviews est vide initialement', () => {
    expect(component.reviews().length).toBe(0);
  });

  it('averageRating est 0 sans avis', () => {
    expect(component.averageRating()).toBe(0);
  });

  it('hasMore est false si reviews.length === reviewsTotal', () => {
    expect(component.hasMore()).toBe(false);
  });

  it('providerId retourne l\'id depuis la route', () => {
    expect(component.providerId).toBe(1);
  });
});
