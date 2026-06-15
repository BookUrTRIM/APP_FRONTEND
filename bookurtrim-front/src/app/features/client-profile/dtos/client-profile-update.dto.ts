export interface ClientProfileUpdateDTO {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  gender?: string | null;
  hair_length?: string | null;
  hair_type?: string | null;
  history_preferences?: string | null;
}
