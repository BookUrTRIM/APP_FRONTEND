import { mapClientProfileDTOToModel } from './client-profile.mapper';
import { Gender, HairLength, HairType } from '../enums';
import type { ClientProfileResponseDTO } from '../dtos';

const MOCK_DTO: ClientProfileResponseDTO = {
  id: 1,
  user_account_id: 5,
  first_name: 'Alice',
  last_name: 'Martin',
  phone: '06 00 00 00 00',
  gender: 'female',
  hair_length: 'long',
  hair_type: 'bouclé',
  history_preferences: 'Coupe régulière',
  stripe_customer_id: 'cus_123',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapClientProfileDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapClientProfileDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.userAccountId).toBe(5);
    expect(model.firstName).toBe('Alice');
    expect(model.lastName).toBe('Martin');
    expect(model.phone).toBe('06 00 00 00 00');
    expect(model.stripeCustomerId).toBe('cus_123');
  });

  it('mappe gender, hairLength, hairType', () => {
    const model = mapClientProfileDTOToModel(MOCK_DTO);
    expect(model.gender).toBe('female');
    expect(model.hairLength).toBe('long');
    expect(model.hairType).toBe('bouclé');
  });

  it('gère les champs nullable à null', () => {
    const model = mapClientProfileDTOToModel({
      ...MOCK_DTO,
      phone: null, gender: null, hair_length: null, hair_type: null,
      history_preferences: null, stripe_customer_id: null,
    });
    expect(model.phone).toBeNull();
    expect(model.gender).toBeNull();
    expect(model.hairLength).toBeNull();
    expect(model.hairType).toBeNull();
  });
});
