export interface IComplianceScopeFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
  compliance_obligation?: string;
}

export interface IComplianceScope {
  id: string;
  name: string;
  description?: string;
  compliance_obligation: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
