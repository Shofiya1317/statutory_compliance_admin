import { IQuestion } from './IQuestions.interface';

export interface IDepartment {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  name: string;
  description: string;
  questions: IQuestion[] | null;
  is_required: boolean;
}
