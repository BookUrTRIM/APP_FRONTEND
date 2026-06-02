export interface ReviewModel {
  id: number;
  appointmentId: number;
  rating: number;
  comment: string | null;
  reviewedAt: string;
}
