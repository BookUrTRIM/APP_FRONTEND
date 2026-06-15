import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderReviewsPage } from './provider-reviews-page';
import { ProviderDetailService } from '../../services/provider-detail.service';

describe('ProviderReviewsPage — logique', () => {
  let component: ProviderReviewsPage;
  let providerDetail: ProviderDetailService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderReviewsPage],
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
    const fixture = TestBed.createComponent(ProviderReviewsPage);
    component = fixture.componentInstance;
    providerDetail = TestBed.inject(ProviderDetailService);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('reviews est vide initialement', () => {
    expect(component.reviews().length).toBe(0);
  });

  it('loadMoreReviews appelle le service avec le providerId', () => {
    const spy = vi.spyOn(providerDetail, 'loadMoreReviews');
    component.loadMoreReviews();
    expect(spy).toHaveBeenCalledWith(1);
  });
});
