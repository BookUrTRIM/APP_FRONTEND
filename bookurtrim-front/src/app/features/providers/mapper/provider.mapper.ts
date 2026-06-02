import type { ProviderResponseDTO } from '../dtos';
import type { ProviderModel } from '../models';

export function mapProviderDTOToModel(dto: ProviderResponseDTO): ProviderModel {
  return {
    id: dto.id,
    userAccountId: dto.user_account_id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    phone: dto.phone,
    businessName: dto.business_name ?? null,
    address: dto.address ?? null,
    stripeAccountId: dto.stripe_account_id ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function getProviderFullName(provider: ProviderModel): string {
  return `${provider.firstName} ${provider.lastName}`;
}

export function getProviderInitials(provider: ProviderModel): string {
  return `${provider.firstName[0]}${provider.lastName[0]}`.toUpperCase();
}
