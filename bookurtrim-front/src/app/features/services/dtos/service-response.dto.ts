export interface ServiceResponseDTO {
  id: number;
  provider_id: number;
  name: string;
  description: string | null;
  base_price: number;
  default_duration: number;
  created_at: string;
  updated_at: string;
}
