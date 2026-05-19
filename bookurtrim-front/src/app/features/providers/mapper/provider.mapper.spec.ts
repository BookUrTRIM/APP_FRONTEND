import { mapProviderDTOToModel, getProviderFullName, getProviderInitials } from './provider.mapper';
import type { ProviderResponseDTO } from '../dtos';

const MOCK_DTO: ProviderResponseDTO = {
  id: 1,
  user_account_id: 2,
  first_name: 'Marie',
  last_name: 'Dubois',
  phone: '06 12 34 56 78',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapProviderDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapProviderDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.firstName).toBe('Marie');
    expect(model.lastName).toBe('Dubois');
    expect(model.phone).toBe('06 12 34 56 78');
  });

  it('gère phone null', () => {
    const model = mapProviderDTOToModel({ ...MOCK_DTO, phone: null });
    expect(model.phone).toBeNull();
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
});
