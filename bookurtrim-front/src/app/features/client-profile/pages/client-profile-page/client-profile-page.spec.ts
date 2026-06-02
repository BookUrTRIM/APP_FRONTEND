import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ClientProfilePage } from './client-profile-page';
import { ClientProfileApiContract } from '../../services/client-profile.api.contract';
import type { ClientProfileResponseDTO } from '../../dtos';

const makeDTO = (): ClientProfileResponseDTO => ({
  id: 1, user_account_id: 5, first_name: 'Alice', last_name: 'Martin',
  phone: null, gender: null, hair_length: null, hair_type: null,
  history_preferences: null, stripe_customer_id: null,
  created_at: '', updated_at: '',
});

class MockApi extends ClientProfileApiContract {
  getMe  = vi.fn().mockReturnValue(of(makeDTO()));
  update = vi.fn().mockReturnValue(of(makeDTO()));
}

describe('ClientProfilePage — logique', () => {
  let component: ClientProfilePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProfilePage],
      providers: [
        provideRouter([]),
        { provide: ClientProfileApiContract, useClass: MockApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientProfilePage);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('isLoading est false avant ngOnInit', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('successMessage est vide initialement', () => {
    expect(component.successMessage()).toBe('');
  });

  it('errorMessage est vide initialement', () => {
    expect(component.errorMessage()).toBe('');
  });
});
