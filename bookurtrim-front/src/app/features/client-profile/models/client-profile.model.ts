import type { Gender, HairLength, HairType } from '../enums';

export interface ClientProfileModel {
  id: number;
  userAccountId: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  gender: Gender | null;
  hairLength: HairLength | null;
  hairType: HairType | null;
  historyPreferences: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}
