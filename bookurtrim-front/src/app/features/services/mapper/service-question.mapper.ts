import type { ServiceQuestionResponseDTO } from '../dtos';
import type { ServiceQuestionModel } from '../models';

export function mapServiceQuestionDTOToModel(dto: ServiceQuestionResponseDTO): ServiceQuestionModel {
  return {
    id:        dto.id,
    serviceId: dto.service_id,
    question:  dto.question,
    options:   dto.options.map(o => ({ label: o.label, extraMinutes: o.extra_minutes })),
    order:     dto.order,
  };
}
