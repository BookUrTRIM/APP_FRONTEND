import type { UserRole } from '../enums';

export interface AuthModel {
  token: string;
  role: UserRole;
}
