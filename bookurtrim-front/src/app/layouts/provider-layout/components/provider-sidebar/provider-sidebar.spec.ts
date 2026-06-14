import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProviderSidebar } from './provider-sidebar';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { AuthApiContract } from '../../../../features/auth/services/auth.api.contract';
import type { ProviderAccountModel } from '../../../../features/provider/models';

const mockAuthApi = { login: () => {}, signup: () => {}, verifyEmail: () => {} };

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

describe('ProviderSidebar', () => {
  let component: ProviderSidebar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderSidebar],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderSidebar);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('expose les liens de navigation', () => {
    expect(component.navItems.map(item => item.path)).toEqual([
      '/pro/dashboard',
      '/pro/planning',
      '/pro/appointments',
      '/pro/services',
      '/pro/profile',
      '/pro/stripe-connect',
    ]);
  });

  it('affiche le badge Stripe si le compte n\'est pas connecté', () => {
    const fixture = TestBed.createComponent(ProviderSidebar);
    fixture.componentRef.setInput('provider', makeProvider({ stripe_account_id: null }));
    expect(fixture.componentInstance.showStripeBadge()).toBe(true);
  });

  it('masque le badge Stripe si le compte est connecté', () => {
    const fixture = TestBed.createComponent(ProviderSidebar);
    fixture.componentRef.setInput('provider', makeProvider({ stripe_account_id: 'acct_123' }));
    expect(fixture.componentInstance.showStripeBadge()).toBe(false);
  });

  it('masque le badge Stripe si le provider est null', () => {
    expect(component.showStripeBadge()).toBe(false);
  });
});
