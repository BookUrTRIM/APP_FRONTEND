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
  service_name: 'Coupe homme',
  specific_request: 'Coupe classique',
  answers: null,
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
    expect(model.serviceName).toBe('Coupe homme');
    expect(model.specificRequest).toBe('Coupe classique');
  });

  it('gère specific_request null', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, specific_request: null });
    expect(model.specificRequest).toBeNull();
  });

  it('gère service_name null', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, service_name: null });
    expect(model.serviceName).toBeNull();
  });

  it('mappe le statut pending', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, status: 'pending' });
    expect(model.status).toBe(AppointmentStatus.PENDING);
  });

  it('mappe le statut completed', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, status: 'completed' });
    expect(model.status).toBe(AppointmentStatus.COMPLETED);
  });

  it('mappe le statut cancelled', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, status: 'cancelled' });
    expect(model.status).toBe(AppointmentStatus.CANCELLED);
  });

  it('mappe le statut expired', () => {
    const model = mapAppointmentDTOToModel({ ...MOCK_DTO, status: 'expired' });
    expect(model.status).toBe(AppointmentStatus.EXPIRED);
  });
});

describe('isCancellable', () => {
  it('PENDING est annulable', () => expect(isCancellable(AppointmentStatus.PENDING)).toBe(true));
  it('CONFIRMED est annulable', () => expect(isCancellable(AppointmentStatus.CONFIRMED)).toBe(true));
  it('COMPLETED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.COMPLETED)).toBe(false));
  it('CANCELLED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.CANCELLED)).toBe(false));
  it('EXPIRED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.EXPIRED)).toBe(false));
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

  it('contient l\'année', () => {
    const result = formatAppointmentDate('2026-06-10T10:00:00Z');
    expect(result).toContain('2026');
  });
});
