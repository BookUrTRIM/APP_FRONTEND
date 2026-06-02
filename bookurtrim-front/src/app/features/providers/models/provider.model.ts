export interface ProviderModel {
  id: number;
  userAccountId: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  businessName: string | null;
  address: string | null;
  stripeAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}
