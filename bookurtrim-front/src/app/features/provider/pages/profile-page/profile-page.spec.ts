import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProfilePage } from './profile-page';
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
  is_single_tenant: false,
  created_at: '',
  updated_at: '',
  ...overrides,
});

const mockProviderAccountApi = {
  getMe: () => of(makeProvider()),
  updateMe: () => of(makeProvider()),
};

describe('ProfilePage — logique', () => {
  let component: ProfilePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProviderAccountApiContract, useValue: mockProviderAccountApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('isLoading est true initialement', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('le formulaire a les champs phone, business_name et address', () => {
    expect(component.form.contains('phone')).toBe(true);
    expect(component.form.contains('business_name')).toBe(true);
    expect(component.form.contains('address')).toBe(true);
  });

  it('business_name a une limite de 150 caractères', () => {
    component.form.patchValue({ business_name: 'a'.repeat(151) });
    expect(component.form.get('business_name')!.hasError('maxlength')).toBe(true);
  });

  it('address a une limite de 255 caractères', () => {
    component.form.patchValue({ address: 'a'.repeat(256) });
    expect(component.form.get('address')!.hasError('maxlength')).toBe(true);
  });
});
