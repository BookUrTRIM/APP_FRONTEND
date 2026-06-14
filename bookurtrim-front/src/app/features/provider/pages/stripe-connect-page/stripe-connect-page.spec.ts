import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { StripeConnectPage } from './stripe-connect-page';
import { StripeConnectService } from '../../services/stripe-connect.service';
import { ProviderAccountApiContract } from '../../services/provider-account.api.contract';
import type { ProviderAccountModel } from '../../models';

const makeProvider = (overrides: Partial<ProviderAccountModel> = {}): ProviderAccountModel => ({
  id: 1,
  user_account_id: 1,
  first_name: 'Jeanne',
  last_name: 'Dupont',
  phone: null,
  business_name: null,
  address: null,
  stripe_account_id: null,
  google_calendar_token_enc: null,
  created_at: '',
  updated_at: '',
  ...overrides,
});

const mockProviderAccountApi = {
  getMe: () => of(makeProvider()),
  updateMe: () => of(makeProvider()),
};

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
        { provide: ProviderAccountApiContract, useValue: mockProviderAccountApi },
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

  it('isConfigured est true si stripe_account_id est présent', () => {
    component['provider'].set(makeProvider({ stripe_account_id: 'acct_123' }));
    expect(component.isConfigured).toBe(true);
  });

  it('isConfigured est false si stripe_account_id est null', () => {
    component['provider'].set(makeProvider({ stripe_account_id: null }));
    expect(component.isConfigured).toBe(false);
  });
});
