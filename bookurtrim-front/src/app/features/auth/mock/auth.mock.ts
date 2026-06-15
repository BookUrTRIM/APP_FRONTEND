import { UserRole } from '../enums';
import type { AuthResponseDTO } from '../dtos';
import type { AuthModel } from '../models';

export const MOCK_AUTH_RESPONSE_CLIENT: AuthResponseDTO = {
  access_token: 'mock.jwt.token.client',
  token_type: 'bearer',
  role: UserRole.CLIENT,
};

export const MOCK_AUTH_RESPONSE_PROVIDER: AuthResponseDTO = {
  access_token: 'mock.jwt.token.provider',
  token_type: 'bearer',
  role: UserRole.PROVIDER,
};

export const MOCK_AUTH_MODEL_CLIENT: AuthModel = {
  token: 'mock.jwt.token.client',
  role: UserRole.CLIENT,
};

export const MOCK_AUTH_MODEL_PROVIDER: AuthModel = {
  token: 'mock.jwt.token.provider',
  role: UserRole.PROVIDER,
};
