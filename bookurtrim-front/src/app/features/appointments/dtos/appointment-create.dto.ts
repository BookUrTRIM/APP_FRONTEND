export interface AppointmentCreateDTO {
  provider_id: number;
  start_at: string;
  end_at: string;
  specific_request?: string | null;
}
