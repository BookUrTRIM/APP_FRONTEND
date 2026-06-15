import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProviderAppointmentListPage } from './provider-appointment-list-page';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentApiContract } from '../../services/appointment.api.contract';
import { PaymentApiContract } from '../../../payments/services/payment.api.contract';
import { AppointmentStatus } from '../../enums';
import type { AppointmentModel } from '../../models';

const makeAppt = (overrides: Partial<AppointmentModel> = {}): AppointmentModel => ({
  id: 1, clientId: 10, providerId: 20,
  startAt: '2026-06-10T10:00:00Z', endAt: '2026-06-10T10:30:00Z',
  status: AppointmentStatus.CONFIRMED, serviceName: 'Coupe',
  specificRequest: null, createdAt: '', updatedAt: '',
  ...overrides,
});

class MockApi extends AppointmentApiContract {
  create           = vi.fn();
  listByClient     = vi.fn().mockReturnValue(of([]));
  listByProvider   = vi.fn().mockReturnValue(of([makeAppt()]));
  cancelByClient   = vi.fn().mockReturnValue(of({}));
  cancelByProvider = vi.fn().mockReturnValue(of(makeAppt({ status: AppointmentStatus.CANCELLED })));
  complete         = vi.fn().mockReturnValue(of(makeAppt({ status: AppointmentStatus.COMPLETED })));
}

class MockPaymentApi extends PaymentApiContract {
  create              = vi.fn();
  getById             = vi.fn();
  listByAppointment   = vi.fn().mockReturnValue(of([]));
  prepare             = vi.fn();
  refundByAppointment = vi.fn().mockReturnValue(of({}));
}

describe('ProviderAppointmentListPage — logique', () => {
  let component: ProviderAppointmentListPage;
  let appointmentService: AppointmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderAppointmentListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppointmentService,
        { provide: AppointmentApiContract, useClass: MockApi },
        { provide: PaymentApiContract, useClass: MockPaymentApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderAppointmentListPage);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('tab par défaut est upcoming', () => {
    expect(component.activeTab()).toBe('upcoming');
  });

  it('change d\'onglet vers history', () => {
    component.activeTab.set('history');
    expect(component.activeTab()).toBe('history');
  });

  it('upcoming filtre les RDV CONFIRMED', () => {
    appointmentService['_providerAppointments'].set([
      makeAppt({ status: AppointmentStatus.CONFIRMED }),
      makeAppt({ id: 2, status: AppointmentStatus.COMPLETED }),
    ]);
    expect(component.upcoming().length).toBe(1);
    expect(component.upcoming()[0].status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('history filtre les RDV COMPLETED, CANCELLED et EXPIRED', () => {
    appointmentService['_providerAppointments'].set([
      makeAppt({ status: AppointmentStatus.CONFIRMED }),
      makeAppt({ id: 2, status: AppointmentStatus.COMPLETED }),
      makeAppt({ id: 3, status: AppointmentStatus.CANCELLED }),
      makeAppt({ id: 4, status: AppointmentStatus.EXPIRED }),
    ]);
    expect(component.history().length).toBe(3);
  });

  it('upcoming ne contient pas les RDV PENDING', () => {
    appointmentService['_providerAppointments'].set([
      makeAppt({ status: AppointmentStatus.PENDING }),
    ]);
    expect(component.upcoming().length).toBe(0);
  });
});
