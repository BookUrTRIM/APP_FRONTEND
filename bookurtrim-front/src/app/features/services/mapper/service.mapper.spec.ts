import { mapServiceDTOToModel, formatDuration } from './service.mapper';
import type { ServiceResponseDTO } from '../dtos';

const MOCK_DTO: ServiceResponseDTO = {
  id: 1,
  provider_id: 5,
  name: 'Coupe homme',
  description: 'Coupe classique',
  base_price: 20,
  default_duration: 30,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapServiceDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapServiceDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.providerId).toBe(5);
    expect(model.name).toBe('Coupe homme');
    expect(model.basePrice).toBe(20);
    expect(model.defaultDuration).toBe(30);
  });

  it('gère description null', () => {
    const model = mapServiceDTOToModel({ ...MOCK_DTO, description: null });
    expect(model.description).toBeNull();
  });
});

describe('formatDuration', () => {
  it('affiche en minutes si < 60', () => expect(formatDuration(30)).toBe('30 min'));
  it('affiche en heures si multiple de 60', () => expect(formatDuration(60)).toBe('1h'));
  it('affiche heures et minutes', () => expect(formatDuration(90)).toBe('1h 30min'));
  it('affiche 0 min', () => expect(formatDuration(0)).toBe('0 min'));
  it('affiche 2h', () => expect(formatDuration(120)).toBe('2h'));
});
