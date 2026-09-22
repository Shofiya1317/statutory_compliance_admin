import { IQuestion } from './IQuestions.interface';

export interface IIndicator {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  name: string;
  description: string;
  questions: IQuestion[];
  standard_indicator_id: string;
}
