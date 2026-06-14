import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProviderTopbar } from './provider-topbar';
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

describe('ProviderTopbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderTopbar],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    }).compileComponents();
  });

  it('crée le composant', () => {
    const fixture = TestBed.createComponent(ProviderTopbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initials et fullName valent "?" et "" sans provider', () => {
    const fixture = TestBed.createComponent(ProviderTopbar);
    expect(fixture.componentInstance.initials()).toBe('?');
    expect(fixture.componentInstance.fullName()).toBe('');
  });

  it('initials et fullName se calculent à partir du provider', () => {
    const fixture = TestBed.createComponent(ProviderTopbar);
    fixture.componentRef.setInput('provider', makeProvider());
    expect(fixture.componentInstance.initials()).toBe('JD');
    expect(fixture.componentInstance.fullName()).toBe('Jeanne Dupont');
  });
});
