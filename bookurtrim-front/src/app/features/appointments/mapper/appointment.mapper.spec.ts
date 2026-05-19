import { mapAppointmentDTOToModel, formatAppointmentDate, formatAppointmentTime, isCancellable } from './appointment.mapper';
import { AppointmentStatus } from '../enums';
import type { AppointmentResponseDTO } from '../dtos';

const MOCK_DTO: AppointmentResponseDTO = {
  id: 1,
  client_id: 10,
  provider_id: 20,
  start_at: '2026-06-10T10:00:00Z',
  end_at: '2026-06-10T10:30:00Z',
  status: 'confirmed',
  specific_request: 'Coupe classique',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapAppointmentDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapAppointmentDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.clientId).toBe(10);
    expect(model.providerId).toBe(20);
    expect(model.startAt).toBe('2026-06-10T10:00:00Z');
    expect(model.endAt).toBe('2026-06-10T10:30:00Z');
    expect(model.status).toBe(AppointmentStatus.CONFIRMED);
    expect(model.specificRequest).toBe('Coupe classique');
  });

  it('gère specific_request null', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, specific_request: null });
    expect(model.specificRequest).toBeNull();
  });
});

describe('isCancellable', () => {
  it('PENDING est annulable', () => expect(isCancellable(AppointmentStatus.PENDING)).toBe(true));
  it('CONFIRMED est annulable', () => expect(isCancellable(AppointmentStatus.CONFIRMED)).toBe(true));
  it('COMPLETED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.COMPLETED)).toBe(false));
  it('CANCELLED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.CANCELLED)).toBe(false));
});

describe('formatAppointmentTime', () => {
  it('retourne HH:MM', () => {
    const result = formatAppointmentTime('2026-06-10T10:00:00Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('formatAppointmentDate', () => {
  it('retourne une chaîne non vide', () => {
    const result = formatAppointmentDate('2026-06-10T10:00:00Z');
    expect(result.length).toBeGreaterThan(0);
  });
});
