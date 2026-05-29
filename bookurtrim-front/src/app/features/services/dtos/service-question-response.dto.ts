export interface ServiceQuestionOptionDTO {
  label: string;
  extra_minutes: number;
}

export interface ServiceQuestionResponseDTO {
  id: number;
  service_id: number;
  question: string;
  options: ServiceQuestionOptionDTO[];
  order: number;
}
