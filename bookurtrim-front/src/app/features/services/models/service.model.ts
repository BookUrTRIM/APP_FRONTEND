export interface ServiceModel {
  id: number;
  providerId: number;
  name: string;
  description: string | null;
  basePrice: number;
  defaultDuration: number;
  createdAt: string;
  updatedAt: string;
}
