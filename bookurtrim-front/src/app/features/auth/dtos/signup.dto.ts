import type { UserRole } from '../enums';

export interface SignupDTO {
  email: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string | null;
}
