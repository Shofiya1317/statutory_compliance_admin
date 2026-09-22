export interface IThemes {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  deleted_at: string;
  name: string;
  description: string;
  standard_module_id?: string;
}
