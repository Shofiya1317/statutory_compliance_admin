export interface Theme {
  id: string;
  name: string;
  description: string;
  sequence: number;
  weightage: number;
  is_deleted: boolean;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  standard : {
    id: string;
    name: string;
  }
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  is_deleted: boolean;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IThemesIndustries {
  id: string;
  weightage: number;
  is_deleted: boolean;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  theme: Theme;
  industry: Industry;
}
