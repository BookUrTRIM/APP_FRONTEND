export interface ServiceUpdateDTO {
  name?: string;
  default_duration?: number;
  base_price?: number;
  deposit_amount?: number | null;
  description?: string | null;
}
