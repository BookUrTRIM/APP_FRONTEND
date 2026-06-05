export interface ServiceModel {
  id: number;
  providerId: number;
  name: string;
  description: string | null;
  basePrice: number;
  depositAmount: number | null;
  defaultDuration: number;
  createdAt: string;
  updatedAt: string;
}
