import type { AppointmentModel } from '../models';
import { AppointmentStatus } from '../enums';

export const MOCK_APPOINTMENTS: AppointmentModel[] = [
  {
    id: 1, clientId: 1, providerId: 1,
    startAt: '2026-06-10T10:00:00Z', endAt: '2026-06-10T10:30:00Z',
    status: AppointmentStatus.CONFIRMED, serviceName: 'Coupe homme', specificRequest: null,
    createdAt: '', updatedAt: '',
  },
  {
    id: 2, clientId: 1, providerId: 2,
    startAt: '2026-06-12T14:00:00Z', endAt: '2026-06-12T15:00:00Z',
    status: AppointmentStatus.PENDING, serviceName: 'Coloration', specificRequest: 'Allergie aux colorants',
    createdAt: '', updatedAt: '',
  },
  {
    id: 3, clientId: 1, providerId: 1,
    startAt: '2026-05-20T09:00:00Z', endAt: '2026-05-20T09:45:00Z',
    status: AppointmentStatus.COMPLETED, serviceName: null, specificRequest: null,
    createdAt: '', updatedAt: '',
  },
];
