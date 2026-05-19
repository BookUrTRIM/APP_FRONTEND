import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { BookingPage } from './booking-page';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';

class MockAppointmentApi extends AppointmentApiContract {
  create          = vi.fn().mockReturnValue(of({}));
  listByClient    = vi.fn().mockReturnValue(of([]));
  listByProvider  = vi.fn().mockReturnValue(of([]));
  cancel          = vi.fn().mockReturnValue(of({}));
  complete        = vi.fn().mockReturnValue(of({}));
}

describe('BookingPage — génération des créneaux', () => {
  let component: BookingPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AppointmentApiContract, useClass: MockAppointmentApi },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap:      { get: () => '1' },
              queryParamMap: { get: () => '2' },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BookingPage);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => expect(component).toBeTruthy());

  it('génère des créneaux de 30 min sur un work de 1h (durée service 30 min)', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: '2099-01-01', start_time: '09:00:00', end_time: '10:00:00', slot_type: 'work' },
    ]);
    component['service'].set({ id: 1, providerId: 1, name: 'Test', description: null, basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '' });
    component.selectedDate.set('2099-01-01');

    const slots = component.slotsForDay();
    expect(slots).toContain('09:00');
    expect(slots).toContain('09:30');
    expect(slots.length).toBe(2);
  });

  it('exclut les créneaux qui chevauchent une pause', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: '2099-01-01', start_time: '09:00:00', end_time: '11:00:00', slot_type: 'work' },
      { id: 2, provider_id: 1, day_date: '2099-01-01', start_time: '09:30:00', end_time: '10:00:00', slot_type: 'break' },
    ]);
    component['service'].set({ id: 1, providerId: 1, name: 'Test', description: null, basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '' });
    component.selectedDate.set('2099-01-01');

    const slots = component.slotsForDay();
    expect(slots).not.toContain('09:30');
    expect(slots).toContain('10:00');
  });

  it('availableDates exclut les jours passés', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: '2099-06-01', start_time: '09:00:00', end_time: '12:00:00', slot_type: 'work' },
      { id: 2, provider_id: 1, day_date: '2020-01-01', start_time: '09:00:00', end_time: '12:00:00', slot_type: 'work' },
    ]);

    const dates = component.availableDates();
    expect(dates.has('2099-06-01')).toBe(true);
    expect(dates.has('2020-01-01')).toBe(false);
  });
});
