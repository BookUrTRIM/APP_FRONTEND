import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ClientProfileService } from './client-profile.service';
import { ClientProfileApiContract } from './client-profile.api.contract';
import type { ClientProfileResponseDTO } from '../dtos';

const makeDTO = (): ClientProfileResponseDTO => ({
  id: 1, user_account_id: 5,
  first_name: 'Alice', last_name: 'Martin',
  phone: null, gender: null, hair_length: null, hair_type: null,
  history_preferences: null, stripe_customer_id: null,
  created_at: '', updated_at: '',
});

class MockApi extends ClientProfileApiContract {
  getMe  = vi.fn().mockReturnValue(of(makeDTO()));
  update = vi.fn().mockReturnValue(of({ ...makeDTO(), phone: '06 00 00 00 00' }));
}

describe('ClientProfileService', () => {
  let service: ClientProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientProfileService,
        { provide: ClientProfileApiContract, useClass: MockApi },
      ],
    });
    service = TestBed.inject(ClientProfileService);
  });

  it('crée le service', () => expect(service).toBeTruthy());

  it('profile est null initialement', () => {
    expect(service.profile()).toBeNull();
  });

  describe('loadMe', () => {
    it('charge et stocke le profil', async () => {
      await firstValueFrom(service.loadMe());
      expect(service.profile()).not.toBeNull();
      expect(service.profile()!.firstName).toBe('Alice');
    });
  });

  describe('update', () => {
    it('met à jour le profil localement', async () => {
      await firstValueFrom(service.update({ phone: '06 00 00 00 00' }));
      expect(service.profile()!.phone).toBe('06 00 00 00 00');
    });
  });
});
