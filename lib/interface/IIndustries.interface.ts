import { ISector } from './ISector.interface';

export interface IIndustries {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  is_delete: boolean;
  description: string;
  sector: ISector | null;
  status: string;
}

export interface IIndustriesFilter {
  page: string;
  limit: string;
  sort: string;
  search: string;
  sector_id: string;
  is_delete: string;
}
