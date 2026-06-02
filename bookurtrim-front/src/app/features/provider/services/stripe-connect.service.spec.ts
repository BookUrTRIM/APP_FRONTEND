import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StripeConnectService } from './stripe-connect.service';

describe('StripeConnectService', () => {
  let service: StripeConnectService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StripeConnectService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StripeConnectService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('crée le service', () => expect(service).toBeTruthy());

  it('createAccount appelle POST /providers/me/stripe-connect', () => {
    service.createAccount().subscribe();
    const req = controller.expectOne(r => r.url.includes('/providers/me/stripe-connect'));
    expect(req.request.method).toBe('POST');
    req.flush({ stripe_account_id: 'acct_123' });
  });

  it('getOnboardingLink appelle GET /providers/me/stripe-connect/onboarding', () => {
    service.getOnboardingLink().subscribe();
    const req = controller.expectOne(r => r.url.includes('/stripe-connect/onboarding'));
    expect(req.request.method).toBe('GET');
    req.flush({ url: 'https://connect.stripe.com/...' });
  });
});
