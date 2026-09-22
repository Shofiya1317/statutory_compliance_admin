/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { IIndicator } from './IIndicator.interface';
import { IThemes } from './IThemes.interface';
import { IQuestion, IQuestionOption } from './IQuestions.interface';

export interface IStandard {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
  description: string;
  logo_url: string;
  is_weightage: boolean;
  is_active: boolean;
  standard_themes: IStandardTheme[];
}

export interface IStandardTheme {
  id: string;
  master_theme_id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
  description: string;
  sequence: number;
  weightage: number;
  standard_indicators: IStandardIndicator[];
}

export interface IStandardModule {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
  description: string;
  sequence: number | null;
  master_theme_id: string;
  standard_indicators: IStandardIndicator[];
}

export interface IStandardIndicator {
  id: string;
  master_indicator_id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
  sequence: number;
  weightage: number;
  description: string;
  standard_questions: IStandardQuestion[];
  master_indicator?: IIndicator;
  question_sequences?: IQuestionSequences[];
}
export interface IStandardQuestion {
  id: string;
  master_question_id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  title: string;
  sequence: number;
  weightage: number;
  description: string;
  question_type: string;
  placeholder: string;
  is_dependent: boolean | null;
  universal_question_id: string;
  is_latest_data: boolean;
  min_range: string;
  max_range: string;
  is_added_sequence: boolean;
  standard_question_options: IStandardQuestionOption[];
  mixed_questions: IMixedQuestion[];
  sub_indicator_id?: string | null | any;
  option_type?: string;
  master_question?: IQuestion;
}

export interface IStandardQuestionOption {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  text: string;
  value: string;
  weightage: string;
}

export interface IMixedQuestion {
  value_question_type?: string;
  value_name?: string;
  value_enum?: string[];
  unit_name?: string;
  unit_type?: string;
  unit_enum?: string[];
  master_mixed_question_id?: string;
}

export interface IQuestionSequences {
  id: string;
  sequence: number;
  is_dependent: boolean;
  questable_type: 'STANDARD' | 'GROUP';
  standard_question_id: IStandardQuestion;
  group_questions: IGroupQuestion;
  question_rules: IQuestionRules[];
  standard_indicators: IStandardIndicator[];
}

export interface IGroupQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  is_multiple: boolean;
  max_limit: number;
  name: string;
  group_rule: IGroupQuestionRule[];
  group_question_sequences: IGroupQuestionSequence[];
}

export interface IGroupQuestionSequence {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  standard_question: IStandardQuestion;
}
export interface IGroupQuestionRule {
  is_deleted: boolean;
  parent_question_id: string;
  dependent_question_id: string;
  parent_question_option_id: string;
  // parent_question_id: IStandardQuestion;
  // dependent_question_id: IStandardQuestion;
  // parent_question_option_id: IQuestionOption;
}

export interface IQuestionRules {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  parent_question_id: IStandardQuestion;
  parent_option_id: IQuestionOption;
  dependent_question_sequence_id: IQuestionSequences;
}
