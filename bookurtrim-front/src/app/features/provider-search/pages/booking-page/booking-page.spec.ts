import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { BookingPage } from './booking-page';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';

class MockAppointmentApi extends AppointmentApiContract {
  create         = vi.fn().mockReturnValue(of({}));
  listByClient   = vi.fn().mockReturnValue(of([]));
  listByProvider = vi.fn().mockReturnValue(of([]));
  cancelByClient = vi.fn().mockReturnValue(of({}));
  cancelByProvider = vi.fn().mockReturnValue(of({}));
  complete       = vi.fn().mockReturnValue(of({}));
}

const MOCK_SERVICE = {
  id: 1, providerId: 1, name: 'Test', description: null,
  basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '',
};

const FUTURE_DATE = '2099-01-01';

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
      { id: 1, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:00:00', end_time: '10:00:00', slot_type: 'work' },
    ]);
    component['service'].set(MOCK_SERVICE);
    component.selectedDate.set(FUTURE_DATE);

    const slots = component.slotsForDay();
    const times = slots.map(s => s.time);
    expect(times).toContain('09:00');
    expect(times).toContain('09:30');
    expect(slots.length).toBe(2);
  });

  it('tous les créneaux sont disponibles sans booked', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:00:00', end_time: '10:00:00', slot_type: 'work' },
    ]);
    component['service'].set(MOCK_SERVICE);
    component.selectedDate.set(FUTURE_DATE);

    const slots = component.slotsForDay();
    expect(slots.every(s => s.available)).toBe(true);
  });

  it('exclut les créneaux qui chevauchent une pause', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:00:00', end_time: '11:00:00', slot_type: 'work' },
      { id: 2, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:30:00', end_time: '10:00:00', slot_type: 'break' },
    ]);
    component['service'].set(MOCK_SERVICE);
    component.selectedDate.set(FUTURE_DATE);

    const times = component.slotsForDay().map(s => s.time);
    expect(times).not.toContain('09:30');
    expect(times).toContain('10:00');
  });

  it('marque les créneaux booked comme non disponibles', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:00:00', end_time: '11:00:00', slot_type: 'work' },
      { id: 2, provider_id: 1, day_date: FUTURE_DATE, start_time: '09:00:00', end_time: '09:30:00', slot_type: 'booked' },
    ]);
    component['service'].set(MOCK_SERVICE);
    component.selectedDate.set(FUTURE_DATE);

    const slots = component.slotsForDay();
    const slot900 = slots.find(s => s.time === '09:00');
    const slot930 = slots.find(s => s.time === '09:30');
    expect(slot900?.available).toBe(false);
    expect(slot930?.available).toBe(false);
    const slot1000 = slots.find(s => s.time === '10:00');
    expect(slot1000?.available).toBe(true);
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

  it('availableDates exclut les slots booked et break', () => {
    component['availabilities'].set([
      { id: 1, provider_id: 1, day_date: '2099-06-01', start_time: '09:00:00', end_time: '12:00:00', slot_type: 'break' },
      { id: 2, provider_id: 1, day_date: '2099-06-02', start_time: '09:00:00', end_time: '12:00:00', slot_type: 'booked' },
    ]);

    const dates = component.availableDates();
    expect(dates.has('2099-06-01')).toBe(false);
    expect(dates.has('2099-06-02')).toBe(false);
  });

  it('retourne liste vide si pas de date sélectionnée', () => {
    component['service'].set(MOCK_SERVICE);
    component.selectedDate.set('');
    expect(component.slotsForDay()).toEqual([]);
  });

  it('questionsConfirmed est false si des questions existent', () => {
    component['questions'].set([
      { id: 1, serviceId: 1, question: 'Type de cheveux ?', options: [{ label: 'Court', extraMinutes: 0 }], order: 1 },
    ]);
    expect(component.questionsConfirmed()).toBe(false);
  });

  it('showQuestionnaire est true si questions non confirmées', () => {
    component['questions'].set([
      { id: 1, serviceId: 1, question: 'Q?', options: [], order: 1 },
    ]);
    component['questionsConfirmed'].set(false);
    expect(component.showQuestionnaire()).toBe(true);
  });

  it('showQuestionnaire est false si pas de questions', () => {
    component['questions'].set([]);
    expect(component.showQuestionnaire()).toBe(false);
  });

  it('allAnswered est true si aucune question', () => {
    component['questions'].set([]);
    expect(component.allAnswered()).toBe(true);
  });

  it('allAnswered est false si une question sans réponse', () => {
    component['questions'].set([
      { id: 1, serviceId: 1, question: 'Q?', options: [{ label: 'A', extraMinutes: 0 }], order: 1 },
    ]);
    expect(component.allAnswered()).toBe(false);
  });

  it('allAnswered est true si toutes les questions ont une réponse', () => {
    component['questions'].set([
      { id: 1, serviceId: 1, question: 'Q?', options: [{ label: 'A', extraMinutes: 0 }], order: 1 },
    ]);
    component['answers'].set({ 1: 0 });
    expect(component.allAnswered()).toBe(true);
  });
});
