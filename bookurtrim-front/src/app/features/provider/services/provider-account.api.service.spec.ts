import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProviderAccountApiService } from './provider-account.api.service';

describe('ProviderAccountApiService', () => {
  let service: ProviderAccountApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProviderAccountApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProviderAccountApiService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('crée le service', () => expect(service).toBeTruthy());

  it('getMe appelle GET /providers/me', () => {
    service.getMe().subscribe();
    const req = controller.expectOne('/providers/me');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1 });
  });

  it('updateMe appelle PATCH /providers/me', () => {
    service.updateMe({ phone: '0600000000' }).subscribe();
    const req = controller.expectOne('/providers/me');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ phone: '0600000000' });
    req.flush({ id: 1 });
  });
});
