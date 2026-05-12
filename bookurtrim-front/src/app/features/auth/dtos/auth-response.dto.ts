import type { UserRole } from '../enums';

export interface AuthResponseDTO {
  access_token: string;
  token_type: string;
  role: UserRole;
}
