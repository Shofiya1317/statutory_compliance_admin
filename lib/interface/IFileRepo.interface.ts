export interface IFileRepo {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  company_name: string;
  year: string;
  report_name: string;
  file_url: string;
}
