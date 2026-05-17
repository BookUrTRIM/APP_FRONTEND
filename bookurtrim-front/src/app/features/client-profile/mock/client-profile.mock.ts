import type { ClientProfileModel } from '../models';
import { Gender, HairLength, HairType } from '../enums';

export const MOCK_CLIENT_PROFILE: ClientProfileModel = {
  id: 1,
  userAccountId: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '06 12 34 56 78',
  gender: Gender.HOMME,
  hairLength: HairLength.COURT,
  hairType: HairType.LISSE,
  historyPreferences: 'Préfère les coupes classiques',
  stripeCustomerId: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};
