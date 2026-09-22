import { IIndustries } from './IIndustries.interface';

export interface ISectorFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
}

export interface ISector {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  industry: IIndustries[];
  status: string;
  question_type?: string;
}
