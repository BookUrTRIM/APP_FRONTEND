import type { AppointmentStatus } from '../enums';

export interface AppointmentModel {
  id: number;
  clientId: number;
  providerId: number;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  specificRequest: string | null;
  createdAt: string;
  updatedAt: string;
}
