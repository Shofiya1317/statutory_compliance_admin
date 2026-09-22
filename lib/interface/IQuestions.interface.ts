import { IQuestionType } from '@/components/types';
import { IDepartment } from './IDepartment.interface';
import { IIndicator } from './IIndicator.interface';
import { ISubIndicator } from './ISubIndicator';

export interface IQuestionOption {
  question_option_id?: string;
  text: string;
  id?: string;
  value: string;
  dependent_question: string[];
  is_deleted: boolean;
  sequence_no: number;
}

export interface IMixedType {
  value_question_type: string;
  value_name: string;
  value_enum: string[];
  unit_type: string;
  unit_name: string;
  unit_enum: string[];
}
export interface IQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  title: string;
  description: string;
  question_type: IQuestionType;
  placeholder: string;
  question_options?: IQuestionOption[];
  indicator: IIndicator | null;
  sub_indicator: ISubIndicator | null;
  department: IDepartment | null;
  sequence: number;
  status: string;
  is_required: boolean;
  is_polymorphic: boolean;
  mixed_type_question: IMixedType;
  is_upload: boolean;
  standard_question_id?: string;
  universal_question_id: string;
  sub_indicator_name: string;
}
