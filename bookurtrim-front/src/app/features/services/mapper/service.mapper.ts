import type { ServiceResponseDTO } from '../dtos';
import type { ServiceModel } from '../models';

export function mapServiceDTOToModel(dto: ServiceResponseDTO): ServiceModel {
  return {
    id: dto.id,
    providerId: dto.provider_id,
    name: dto.name,
    description: dto.description,
    basePrice:      dto.base_price,
    depositAmount:  dto.deposit_amount ?? null,
    defaultDuration: dto.default_duration,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}
