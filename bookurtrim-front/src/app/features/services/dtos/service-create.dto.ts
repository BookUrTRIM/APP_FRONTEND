export interface ServiceCreateDTO {
  name: string;
  default_duration: number;
  base_price: number;
  description?: string | null;
}
