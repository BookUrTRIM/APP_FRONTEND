import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { AppointmentService } from './appointment.service';
import { AppointmentApiContract } from './appointment.api.contract';
import { AppointmentStatus } from '../enums';
import type { AppointmentResponseDTO } from '../dtos';

const makeDTO = (overrides: Partial<AppointmentResponseDTO> = {}): AppointmentResponseDTO => ({
  id: 1, client_id: 10, provider_id: 20,
  start_at: '2026-06-10T10:00:00Z', end_at: '2026-06-10T10:30:00Z',
  status: 'confirmed', service_name: 'Coupe', specific_request: null,
  answers: null, created_at: '', updated_at: '',
  ...overrides,
});

class MockApi extends AppointmentApiContract {
  create           = vi.fn();
  listByClient     = vi.fn().mockReturnValue(of([makeDTO()]));
  listByProvider   = vi.fn().mockReturnValue(of([]));
  cancelByClient   = vi.fn().mockReturnValue(of(makeDTO({ status: 'cancelled' })));
  cancelByProvider = vi.fn().mockReturnValue(of(makeDTO({ status: 'cancelled' })));
  complete         = vi.fn().mockReturnValue(of(makeDTO({ status: 'completed' })));
}

describe('AppointmentService', () => {
  let service: AppointmentService;
  let mockApi: MockApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        { provide: AppointmentApiContract, useClass: MockApi },
      ],
    });
    service = TestBed.inject(AppointmentService);
    mockApi = TestBed.inject(AppointmentApiContract) as MockApi;
  });

  describe('loadMyAppointments', () => {
    it('charge et stocke les rendez-vous client', async () => {
      await firstValueFrom(service.loadMyAppointments());
      expect(service.appointments().length).toBe(1);
      expect(service.appointments()[0].status).toBe(AppointmentStatus.CONFIRMED);
    });

    it('filtre upcoming (CONFIRMED)', async () => {
      await firstValueFrom(service.loadMyAppointments());
      expect(service.upcoming().length).toBe(1);
    });

    it('filtre awaitingPayment (PENDING)', async () => {
      mockApi.listByClient = vi.fn().mockReturnValue(of([makeDTO({ status: 'pending' })]));
      await firstValueFrom(service.loadMyAppointments());
      expect(service.awaitingPayment().length).toBe(1);
    });

    it('filtre past (COMPLETED)', async () => {
      mockApi.listByClient = vi.fn().mockReturnValue(of([makeDTO({ status: 'completed' })]));
      await firstValueFrom(service.loadMyAppointments());
      expect(service.past().length).toBe(1);
    });

    it('gère une réponse paginée { items, total, page, limit }', async () => {
      mockApi.listByClient = vi.fn().mockReturnValue(
        of({ items: [makeDTO(), makeDTO({ id: 2 })], total: 2, page: 1, limit: 20 })
      );
      await firstValueFrom(service.loadMyAppointments());
      expect(service.appointments().length).toBe(2);
    });

    it('gère une réponse tableau plat (non paginée)', async () => {
      mockApi.listByClient = vi.fn().mockReturnValue(of([makeDTO()]));
      await firstValueFrom(service.loadMyAppointments());
      expect(service.appointments().length).toBe(1);
    });
  });

  describe('cancel', () => {
    it('met à jour le statut localement après annulation client', async () => {
      await firstValueFrom(service.loadMyAppointments());
      await firstValueFrom(service.cancel(1));
      const appt = service.appointments().find(a => a.id === 1);
      expect(appt?.status).toBe(AppointmentStatus.CANCELLED);
    });
  });

  describe('patchProviderStatus', () => {
    it('met à jour le statut d\'un rendez-vous provider localement', () => {
      service['_providerAppointments'].set([
        { id: 5, clientId: 1, providerId: 1, startAt: '', endAt: '',
          status: AppointmentStatus.CONFIRMED, serviceName: null,
          specificRequest: null, createdAt: '', updatedAt: '' }
      ]);
      service.patchProviderStatus(5, AppointmentStatus.CANCELLED);
      const appt = service.providerAppointments().find(a => a.id === 5);
      expect(appt?.status).toBe(AppointmentStatus.CANCELLED);
    });
  });

  describe('complete', () => {
    it('met à jour le statut du provider localement', async () => {
      service['_providerAppointments'].set([
        { id: 1, clientId: 10, providerId: 20, startAt: '', endAt: '',
          status: AppointmentStatus.CONFIRMED, serviceName: null,
          specificRequest: null, createdAt: '', updatedAt: '' }
      ]);
      await firstValueFrom(service.complete(1));
      const appt = service.providerAppointments().find(a => a.id === 1);
      expect(appt?.status).toBe(AppointmentStatus.COMPLETED);
    });
  });
});
