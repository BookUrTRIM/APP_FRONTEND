export interface ServiceQuestionOption {
  label: string;
  extraMinutes: number;
}

export interface ServiceQuestionModel {
  id: number;
  serviceId: number;
  question: string;
  options: ServiceQuestionOption[];
  order: number;
}
