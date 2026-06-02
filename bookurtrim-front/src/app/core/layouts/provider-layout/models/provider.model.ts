export interface ProviderModel {
  id: number;
  user_account_id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  business_name: string | null;
  address: string | null;
  stripe_account_id: string | null;
  google_calendar_token_enc: string | null;
  created_at: string;
  updated_at: string;
}
