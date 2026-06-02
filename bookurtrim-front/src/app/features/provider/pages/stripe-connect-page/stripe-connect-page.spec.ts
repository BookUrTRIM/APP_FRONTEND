import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StripeConnectPage } from './stripe-connect-page';
import { StripeConnectService } from '../../services/stripe-connect.service';

describe('StripeConnectPage — logique', () => {
  let component: StripeConnectPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeConnectPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        StripeConnectService,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(StripeConnectPage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('isLoading est true initialement', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('isActing est false initialement', () => {
    expect(component.isActing()).toBe(false);
  });

  it('isConfigured est false si provider est null', () => {
    expect(component.isConfigured).toBe(false);
  });

  it('isConfigured est true si stripeAccountId est présent', () => {
    component['provider'].set({
      id: 1, userAccountId: 1, firstName: 'J', lastName: 'D',
      phone: null, businessName: null, address: null,
      stripeAccountId: 'acct_123', createdAt: '', updatedAt: '',
    });
    expect(component.isConfigured).toBe(true);
  });

  it('isConfigured est false si stripeAccountId est null', () => {
    component['provider'].set({
      id: 1, userAccountId: 1, firstName: 'J', lastName: 'D',
      phone: null, businessName: null, address: null,
      stripeAccountId: null, createdAt: '', updatedAt: '',
    });
    expect(component.isConfigured).toBe(false);
  });
});
