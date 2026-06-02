export interface AppointmentAnswerDTO {
  question: string;
  answer: string;
  extra_minutes: number;
}

export interface AppointmentCreateDTO {
  provider_id: number;
  service_id: number;
  start_at: string;
  end_at: string;
  specific_request?: string | null;
  answers?: AppointmentAnswerDTO[];
}
