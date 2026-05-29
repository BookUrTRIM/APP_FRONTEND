import { AvailabilityCreateDTO, PlanningFormValue } from '../models/availability.models';

export class AvailabilityMapper {

  static toBulkCreateDTOs(formValue: PlanningFormValue): AvailabilityCreateDTO[] {
    const dtos: AvailabilityCreateDTO[] = [];
    const [y, m, d] = formValue.start_date.split('-').map(Number);
    const startDate = new Date(y, m - 1, d);
    const totalDaysToScan = (formValue.recurring_weeks || 1) * 7;
    for (let i = 0; i < totalDaysToScan; i++) {
      const currentDate = new Date(startDate.getTime());
      currentDate.setDate(startDate.getDate() + i);
      const currentDayOfWeek = currentDate.getDay();
      if (formValue.days_of_week.includes(currentDayOfWeek)) {
        dtos.push({
          day_date: currentDate.toISOString().split('T')[0],
          start_time: `${formValue.start_time}:00`,
          end_time: `${formValue.end_time}:00`,
          slot_type: formValue.slot_type
        });
      }
    }
    return dtos;
  }

  static toAbsenceDTO(date: string): AvailabilityCreateDTO[] {
    return [{
      day_date: date,
      start_time: '00:00:00',
      end_time: '23:59:59',
      slot_type: 'break'
    }];
  }
}
