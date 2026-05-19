export interface AppointmentResponseDTO {
  id: number;
  client_id: number;
  provider_id: number;
  start_at: string;
  end_at: string;
  status: string;
  specific_request: string | null;
  created_at: string;
  updated_at: string;
}
