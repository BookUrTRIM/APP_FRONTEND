import type { AppointmentResponseDTO } from '../dtos';
import type { AppointmentModel } from '../models';
import { AppointmentStatus } from '../enums';

export function mapAppointmentDTOToModel(dto: AppointmentResponseDTO): AppointmentModel {
  return {
    id:              dto.id,
    clientId:        dto.client_id,
    providerId:      dto.provider_id,
    startAt:         dto.start_at,
    endAt:           dto.end_at,
    status:          dto.status as AppointmentStatus,
    serviceName:      dto.service_name ?? null,
    serviceBasePrice: dto.service_base_price ?? null,
    depositAmount:    dto.deposit_amount ?? null,
    specificRequest:  dto.specific_request,
    createdAt:       dto.created_at,
    updatedAt:       dto.updated_at,
  };
}

export function formatAppointmentDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatAppointmentTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function isCancellable(status: AppointmentStatus): boolean {
  return status === AppointmentStatus.PENDING || status === AppointmentStatus.CONFIRMED;
}
