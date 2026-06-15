import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AppointmentListPage } from './appointment-list-page';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentApiContract } from '../../services/appointment.api.contract';
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
  listByClient     = vi.fn().mockReturnValue(of([makeAppt()]));
  listByProvider   = vi.fn().mockReturnValue(of([]));
  cancelByClient   = vi.fn().mockReturnValue(of(makeAppt({ status: AppointmentStatus.CANCELLED })));
  cancelByProvider = vi.fn().mockReturnValue(of({}));
  complete         = vi.fn().mockReturnValue(of({}));
}

describe('AppointmentListPage — logique', () => {
  let component: AppointmentListPage;
  let appointmentService: AppointmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppointmentService,
        { provide: AppointmentApiContract, useClass: MockApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppointmentListPage);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('tab par défaut est upcoming', () => {
    expect(component.activeTab).toBe('upcoming');
  });

  it('change d\'onglet vers past', () => {
    component.activeTab = 'past';
    expect(component.activeTab).toBe('past');
  });

  it('awaitingPayment retourne les RDV PENDING', () => {
    appointmentService['_clientAppointments'].set([
      makeAppt({ status: AppointmentStatus.PENDING }),
      makeAppt({ id: 2, status: AppointmentStatus.CONFIRMED }),
    ]);
    expect(component.awaitingPayment().length).toBe(1);
    expect(component.awaitingPayment()[0].status).toBe(AppointmentStatus.PENDING);
  });

  it('upcoming retourne les RDV CONFIRMED', () => {
    appointmentService['_clientAppointments'].set([
      makeAppt({ status: AppointmentStatus.CONFIRMED }),
      makeAppt({ id: 2, status: AppointmentStatus.PENDING }),
    ]);
    expect(component.upcoming().length).toBe(1);
  });

  it('past retourne les RDV COMPLETED, CANCELLED et EXPIRED', () => {
    appointmentService['_clientAppointments'].set([
      makeAppt({ status: AppointmentStatus.COMPLETED }),
      makeAppt({ id: 2, status: AppointmentStatus.CANCELLED }),
      makeAppt({ id: 3, status: AppointmentStatus.EXPIRED }),
      makeAppt({ id: 4, status: AppointmentStatus.CONFIRMED }),
    ]);
    expect(component.past().length).toBe(3);
  });
});
