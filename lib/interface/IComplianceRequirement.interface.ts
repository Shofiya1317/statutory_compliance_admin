export interface IComplianceRequirementFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
}

export interface IComplianceRequirement {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
