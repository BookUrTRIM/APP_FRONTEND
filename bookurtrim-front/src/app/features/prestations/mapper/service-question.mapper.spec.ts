import { mapServiceQuestionDTOToModel } from './service-question.mapper';
import type { ServiceQuestionResponseDTO } from '../dtos';

const MOCK_DTO: ServiceQuestionResponseDTO = {
  id: 1,
  service_id: 10,
  question: 'Type de cheveux ?',
  options: [
    { label: 'Court', extra_minutes: 0 },
    { label: 'Long', extra_minutes: 15 },
  ],
  order: 1,
};

describe('mapServiceQuestionDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapServiceQuestionDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.serviceId).toBe(10);
    expect(model.question).toBe('Type de cheveux ?');
    expect(model.order).toBe(1);
  });

  it('mappe les options avec extraMinutes', () => {
    const model = mapServiceQuestionDTOToModel(MOCK_DTO);
    expect(model.options).toHaveLength(2);
    expect(model.options[0].label).toBe('Court');
    expect(model.options[0].extraMinutes).toBe(0);
    expect(model.options[1].label).toBe('Long');
    expect(model.options[1].extraMinutes).toBe(15);
  });

  it('gère une liste d\'options vide', () => {
    const model = mapServiceQuestionDTOToModel({ ...MOCK_DTO, options: [] });
    expect(model.options).toHaveLength(0);
  });
});
