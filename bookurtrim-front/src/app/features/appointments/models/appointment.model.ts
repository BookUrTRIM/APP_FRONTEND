import type { AppointmentStatus } from '../enums';

export interface AppointmentModel {
  id: number;
  clientId: number;
  providerId: number;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  serviceName: string | null;
  serviceBasePrice: number | null;
  depositAmount: number | null;
  specificRequest: string | null;
  createdAt: string;
  updatedAt: string;
}
