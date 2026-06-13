import { mapProviderDTOToModel, getProviderFullName, getProviderInitials } from './provider.mapper';
import type { ProviderResponseDTO } from '../dtos';

const MOCK_DTO: ProviderResponseDTO = {
  id: 1,
  user_account_id: 2,
  first_name: 'Marie',
  last_name: 'Dubois',
  phone: '06 12 34 56 78',
  business_name: 'Salon Marie',
  address: '12 rue de la Paix, Paris',
  stripe_account_id: 'acct_123',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapProviderDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapProviderDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.userAccountId).toBe(2);
    expect(model.firstName).toBe('Marie');
    expect(model.lastName).toBe('Dubois');
    expect(model.phone).toBe('06 12 34 56 78');
    expect(model.businessName).toBe('Salon Marie');
    expect(model.address).toBe('12 rue de la Paix, Paris');
    expect(model.stripeAccountId).toBe('acct_123');
  });

  it('gère phone null', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, phone: null });
    expect(model.phone).toBeNull();
  });

  it('gère business_name null', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, business_name: null });
    expect(model.businessName).toBeNull();
  });

  it('gère address null', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, address: null });
    expect(model.address).toBeNull();
  });

  it('gère stripe_account_id null', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, stripe_account_id: null });
    expect(model.stripeAccountId).toBeNull();
  });
});

describe('getProviderFullName', () => {
  it('retourne prénom + nom', () => {
    const model = mapProviderDTOToModel(MOCK_DTO);
    expect(getProviderFullName(model)).toBe('Marie Dubois');
  });
});

describe('getProviderInitials', () => {
  it('retourne les initiales en majuscules', () => {
    const model = mapProviderDTOToModel(MOCK_DTO);
    expect(getProviderInitials(model)).toBe('MD');
  });

  it('retourne les initiales en majuscules pour un autre nom', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, first_name: 'Jean', last_name: 'Dupont' });
    expect(getProviderInitials(model)).toBe('JD');
  });
});
