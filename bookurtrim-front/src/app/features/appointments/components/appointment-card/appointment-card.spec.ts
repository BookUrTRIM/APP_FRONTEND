import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppointmentCardComponent } from './appointment-card';
import { AppointmentStatus } from '../../enums';
import { isCancellable } from '../../mapper';
import type { AppointmentModel } from '../../models';

const makeAppointment = (overrides: Partial<AppointmentModel> = {}): AppointmentModel => ({
  id: 1, clientId: 10, providerId: 20,
  startAt: '2026-06-10T10:00:00Z', endAt: '2026-06-10T10:30:00Z',
  status: AppointmentStatus.CONFIRMED,
  serviceName: 'Coupe homme', specificRequest: null,
  createdAt: '', updatedAt: '',
  ...overrides,
});

describe('AppointmentCardComponent — logique', () => {
  let component: AppointmentCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('appointment', makeAppointment());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('statusLabel contient tous les statuts', () => {
    expect(component.statusLabel[AppointmentStatus.PENDING]).toBeTruthy();
    expect(component.statusLabel[AppointmentStatus.CONFIRMED]).toBeTruthy();
    expect(component.statusLabel[AppointmentStatus.COMPLETED]).toBeTruthy();
    expect(component.statusLabel[AppointmentStatus.CANCELLED]).toBeTruthy();
    expect(component.statusLabel[AppointmentStatus.EXPIRED]).toBeTruthy();
  });

  it('statusClass contient tous les statuts', () => {
    expect(component.statusClass[AppointmentStatus.CONFIRMED]).toContain('green');
    expect(component.statusClass[AppointmentStatus.PENDING]).toContain('yellow');
    expect(component.statusClass[AppointmentStatus.CANCELLED]).toContain('red');
    expect(component.statusClass[AppointmentStatus.EXPIRED]).toContain('orange');
  });
});

describe('isCancellable (logique réutilisée par la card)', () => {
  it('PENDING est annulable', () => expect(isCancellable(AppointmentStatus.PENDING)).toBe(true));
  it('CONFIRMED est annulable', () => expect(isCancellable(AppointmentStatus.CONFIRMED)).toBe(true));
  it('COMPLETED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.COMPLETED)).toBe(false));
  it('CANCELLED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.CANCELLED)).toBe(false));
  it('EXPIRED n\'est pas annulable', () => expect(isCancellable(AppointmentStatus.EXPIRED)).toBe(false));
});
