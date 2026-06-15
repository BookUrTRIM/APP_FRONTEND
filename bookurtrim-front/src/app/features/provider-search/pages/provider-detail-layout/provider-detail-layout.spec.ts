import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderDetailLayout } from './provider-detail-layout';
import { ProviderDetailService } from '../../services/provider-detail.service';

describe('ProviderDetailLayout — logique', () => {
  let component: ProviderDetailLayout;
  let providerDetail: ProviderDetailService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderDetailLayout],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderDetailLayout);
    component = fixture.componentInstance;
    providerDetail = fixture.debugElement.injector.get(ProviderDetailService);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('providerId retourne l\'id depuis la route', () => {
    expect(component.providerId).toBe(1);
  });

  it('ngOnInit déclenche le chargement du prestataire', () => {
    const loadSpy = vi.spyOn(providerDetail, 'load');
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalledWith(1);
  });
});
