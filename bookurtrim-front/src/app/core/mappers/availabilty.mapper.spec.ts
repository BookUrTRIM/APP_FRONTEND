import { AvailabilityMapper } from './availabilty.mapper';
import type { PlanningFormValue } from '../models/availability.models';

// 2099-06-02 = dimanche (0) — vérifié par le test
const BASE_FORM: PlanningFormValue = {
  start_date: '2099-06-02',
  days_of_week: [0],
  start_time: '09:00',
  end_time: '17:00',
  slot_type: 'work',
  recurring_weeks: 1,
};

describe('AvailabilityMapper.toBulkCreateDTOs', () => {
  it('génère un slot pour le dimanche si days_of_week = [0]', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs(BASE_FORM);
    expect(dtos.length).toBe(1);
    expect(dtos[0].slot_type).toBe('work');
    expect(dtos[0].start_time).toBe('09:00:00');
    expect(dtos[0].end_time).toBe('17:00:00');
  });

  it('génère aucun slot si days_of_week est vide', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs({ ...BASE_FORM, days_of_week: [] });
    expect(dtos.length).toBe(0);
  });

  it('génère des slots pour plusieurs semaines', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs({ ...BASE_FORM, recurring_weeks: 2 });
    expect(dtos.length).toBe(2);
  });

  it('génère des slots pour plusieurs jours par semaine', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs({ ...BASE_FORM, days_of_week: [0, 1], recurring_weeks: 1 });
    expect(dtos.length).toBe(2);
  });

  it('génère des slots break', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs({ ...BASE_FORM, slot_type: 'break' });
    expect(dtos[0].slot_type).toBe('break');
  });

  it('formate correctement day_date en YYYY-MM-DD', () => {
    const dtos = AvailabilityMapper.toBulkCreateDTOs(BASE_FORM);
    expect(dtos[0].day_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('AvailabilityMapper.toAbsenceDTO', () => {
  it('génère un slot break couvrant toute la journée', () => {
    const dtos = AvailabilityMapper.toAbsenceDTO('2099-06-10');
    expect(dtos.length).toBe(1);
    expect(dtos[0].day_date).toBe('2099-06-10');
    expect(dtos[0].slot_type).toBe('break');
    expect(dtos[0].start_time).toBe('00:00:00');
    expect(dtos[0].end_time).toBe('23:59:59');
  });
});
