export interface IComplianceObligationFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
  section?: string;
  applicability_rule?: string;
}

export interface IComplianceObligation {
  id: string;
  name: string;
  description?: string;
  section: string;
  applicability_rule: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
