import type { ServiceModel } from '../models';

export const MOCK_SERVICES: ServiceModel[] = [
  { id: 1, providerId: 1, name: 'Coupe homme', description: 'Coupe classique', basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '' },
  { id: 2, providerId: 1, name: 'Coupe + barbe', description: null, basePrice: 35, defaultDuration: 45, createdAt: '', updatedAt: '' },
  { id: 3, providerId: 1, name: 'Soin capillaire', description: 'Masque et coiffage', basePrice: 50, defaultDuration: 60, createdAt: '', updatedAt: '' },
];
