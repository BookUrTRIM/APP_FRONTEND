export interface AvailabilityResponseDTO {
  id: number;
  provider_id: number;
  day_date: string;
  start_time: string;
  end_time: string;
  slot_type: 'work' | 'break';
}

export interface AvailabilityCreateDTO {
  day_date: string;
  start_time: string;
  end_time: string;
  slot_type: 'work' | 'break';
}

export interface PlanningFormValue {
  start_date: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  slot_type: 'work' | 'break';
  recurring_weeks: number;
}
