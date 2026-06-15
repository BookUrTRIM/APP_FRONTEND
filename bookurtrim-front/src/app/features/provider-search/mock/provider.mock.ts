import type { ProviderModel } from '../models';

export const MOCK_PROVIDERS: ProviderModel[] = [
  { id: 1, userAccountId: 1, firstName: 'Marie', lastName: 'Dubois', phone: '06 12 34 56 78', businessName: 'Salon Marie', address: null, stripeAccountId: null, isSingleTenant: false, createdAt: '', updatedAt: '' },
  { id: 2, userAccountId: 2, firstName: 'Thomas', lastName: 'Martin', phone: null, businessName: null, address: null, stripeAccountId: null, isSingleTenant: false, createdAt: '', updatedAt: '' },
  { id: 3, userAccountId: 3, firstName: 'Ines', lastName: 'Bernard', phone: '07 98 76 54 32', businessName: 'Studio Ines', address: '12 rue de la Paix, Paris', stripeAccountId: null, isSingleTenant: false, createdAt: '', updatedAt: '' },
];
