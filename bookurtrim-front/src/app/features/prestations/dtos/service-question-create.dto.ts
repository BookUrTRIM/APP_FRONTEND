import type { ServiceQuestionOptionDTO } from './service-question-response.dto';

export interface ServiceQuestionCreateDTO {
  question: string;
  options: ServiceQuestionOptionDTO[];
  order?: number;
}
