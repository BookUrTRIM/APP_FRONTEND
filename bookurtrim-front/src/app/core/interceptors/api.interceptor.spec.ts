import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { apiInterceptor } from './api.interceptor';

describe('apiInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('préfixe les URLs relatives avec le base URL', () => {
    http.get('/providers').subscribe();
    const req = controller.expectOne(r => r.url.includes('/providers'));
    expect(req.request.url).toContain('localhost:8000');
    req.flush([]);
  });

  it('ne préfixe pas les URLs absolues (API externe)', () => {
    http.get('https://api-adresse.data.gouv.fr/search/?q=paris').subscribe();
    const req = controller.expectOne('https://api-adresse.data.gouv.fr/search/?q=paris');
    expect(req.request.url).toBe('https://api-adresse.data.gouv.fr/search/?q=paris');
    req.flush({ features: [] });
  });

  it('ajoute le header Authorization si token présent', () => {
    localStorage.setItem('access_token', 'my-token');
    http.get('/appointments/client').subscribe();
    const req = controller.expectOne(r => r.url.includes('/appointments/client'));
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush([]);
  });

  it('n\'ajoute pas le header Authorization si pas de token', () => {
    http.get('/providers').subscribe();
    const req = controller.expectOne(r => r.url.includes('/providers'));
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
