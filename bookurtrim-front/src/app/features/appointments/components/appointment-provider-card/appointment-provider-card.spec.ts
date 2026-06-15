import { TestBed } from '@angular/core/testing';
import { AppointmentProviderCardComponent } from './appointment-provider-card';
import { AppointmentStatus } from '../../enums';
import type { AppointmentModel } from '../../models';

const makeAppointment = (overrides: Partial<AppointmentModel> = {}): AppointmentModel => ({
  id: 1, clientId: 10, providerId: 20,
  startAt: '2026-06-10T10:00:00Z', endAt: '2026-06-10T10:30:00Z',
  status: AppointmentStatus.CONFIRMED,
  serviceName: 'Coupe', specificRequest: null,
  createdAt: '', updatedAt: '',
  ...overrides,
});

describe('AppointmentProviderCardComponent — logique', () => {
  let component: AppointmentProviderCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentProviderCardComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppointmentProviderCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('appointment', makeAppointment());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('statusLabel contient tous les statuts', () => {
    expect(component.statusLabel[AppointmentStatus.CONFIRMED]).toBe('Confirmé');
    expect(component.statusLabel[AppointmentStatus.PENDING]).toBe('En attente de paiement');
    expect(component.statusLabel[AppointmentStatus.COMPLETED]).toBe('Terminé');
    expect(component.statusLabel[AppointmentStatus.CANCELLED]).toBe('Annulé');
    expect(component.statusLabel[AppointmentStatus.EXPIRED]).toBe('Expiré');
  });

  it('émet onCancel avec l\'id du rendez-vous', () => {
    let emitted: number | null = null;
    component.onCancel.subscribe((id: number) => emitted = id);
    component.onCancel.emit(1);
    expect(emitted).toBe(1);
  });

  it('émet onComplete avec l\'id du rendez-vous', () => {
    let emitted: number | null = null;
    component.onComplete.subscribe((id: number) => emitted = id);
    component.onComplete.emit(1);
    expect(emitted).toBe(1);
  });

  it('émet onRefund avec l\'id du rendez-vous', () => {
    let emitted: number | null = null;
    component.onRefund.subscribe((id: number) => emitted = id);
    component.onRefund.emit(1);
    expect(emitted).toBe(1);
  });

  it('appointment() retourne l\'appointment passé en input', () => {
    expect(component.appointment().id).toBe(1);
    expect(component.appointment().status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('isActing est false par défaut', () => {
    expect(component.isActing()).toBe(false);
  });
});
