import type { ClientProfileResponseDTO } from '../dtos';
import type { ClientProfileModel } from '../models';
import { Gender, HairLength, HairType } from '../enums';

export function mapClientProfileDTOToModel(dto: ClientProfileResponseDTO): ClientProfileModel {
  return {
    id: dto.id,
    userAccountId: dto.user_account_id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    phone: dto.phone,
    gender: dto.gender as Gender | null,
    hairLength: dto.hair_length as HairLength | null,
    hairType: dto.hair_type as HairType | null,
    historyPreferences: dto.history_preferences,
    stripeCustomerId: dto.stripe_customer_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
