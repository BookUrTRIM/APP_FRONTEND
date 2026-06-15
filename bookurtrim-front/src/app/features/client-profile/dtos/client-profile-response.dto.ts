export interface ClientProfileResponseDTO {
  id: number;
  user_account_id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  gender: string | null;
  hair_length: string | null;
  hair_type: string | null;
  history_preferences: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}
