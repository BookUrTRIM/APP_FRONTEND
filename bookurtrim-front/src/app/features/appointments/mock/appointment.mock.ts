import type { AppointmentModel } from '../models';
import { AppointmentStatus } from '../enums';

export const MOCK_APPOINTMENTS: AppointmentModel[] = [
  {
    id: 1, clientId: 1, providerId: 1,
    startAt: '2026-06-10T10:00:00Z', endAt: '2026-06-10T10:30:00Z',
    status: AppointmentStatus.CONFIRMED, specificRequest: null,
    createdAt: '', updatedAt: '',
  },
  {
    id: 2, clientId: 1, providerId: 2,
    startAt: '2026-06-12T14:00:00Z', endAt: '2026-06-12T15:00:00Z',
    status: AppointmentStatus.PENDING, specificRequest: 'Allergie aux colorants',
    createdAt: '', updatedAt: '',
  },
  {
    id: 3, clientId: 1, providerId: 1,
    startAt: '2026-05-20T09:00:00Z', endAt: '2026-05-20T09:45:00Z',
    status: AppointmentStatus.COMPLETED, specificRequest: null,
    createdAt: '', updatedAt: '',
  },
];
