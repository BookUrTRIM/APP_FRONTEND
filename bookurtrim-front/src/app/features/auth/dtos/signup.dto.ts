import type { UserRole } from '../enums';

export interface SignupDTO {
  email: string;
  password: string;
  role: UserRole;
}
