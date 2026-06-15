import type { AuthResponseDTO } from '../dtos';
import type { AuthModel } from '../models';

export function mapAuthResponseToModel(dto: AuthResponseDTO): AuthModel {
  return {
    token: dto.access_token,
    role: dto.role,
  };
}
