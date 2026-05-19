import { mapAuthResponseToModel } from './auth.mapper';
import { UserRole } from '../enums';
import type { AuthResponseDTO } from '../dtos';

describe('mapAuthResponseToModel', () => {
  it('mappe un client', () => {
    const dto: AuthResponseDTO = { access_token: 'abc', token_type: 'bearer', role: UserRole.CLIENT };
    const model = mapAuthResponseToModel(dto);
    expect(model.token).toBe('abc');
    expect(model.role).toBe(UserRole.CLIENT);
  });

  it('mappe un provider', () => {
    const dto: AuthResponseDTO = { access_token: 'xyz', token_type: 'bearer', role: UserRole.PROVIDER };
    const model = mapAuthResponseToModel(dto);
    expect(model.token).toBe('xyz');
    expect(model.role).toBe(UserRole.PROVIDER);
  });
});
