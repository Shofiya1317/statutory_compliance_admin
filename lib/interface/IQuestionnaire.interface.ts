export interface IQuestionnaireFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
  type?: string;
  compliance_scope?: string;
}

export interface IQuestionnaire {
  id: string;
  universal_question_id?: string;
  title: string;
  description?: string;
  type: string;
  options?: string[];
  placeholder?: string;
  compliance_scope: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
