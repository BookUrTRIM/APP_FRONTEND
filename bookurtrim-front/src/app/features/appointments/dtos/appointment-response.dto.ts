export interface AppointmentResponseDTO {
  id: number;
  client_id: number;
  provider_id: number;
  start_at: string;
  end_at: string;
  status: string;
  service_name: string | null;
  specific_request: string | null;
  answers: { question: string; answer: string; extra_minutes: number }[] | null;
  created_at: string;
  updated_at: string;
}
