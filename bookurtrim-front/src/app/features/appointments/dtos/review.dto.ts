export interface ReviewCreateDTO {
  rating: number;
  comment?: string | null;
}

export interface ReviewResponseDTO {
  id: number;
  appointment_id: number;
  rating: number;
  comment: string | null;
  reviewed_at: string;
}
