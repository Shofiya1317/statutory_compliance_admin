export interface IApplicabilityRulesFilter {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  status?: string;
  sector?: string;
  state?: string;
  listing_status?: string;
}

export interface IApplicabilityRules {
  id: string;
  name: string;
  description?: string;
  state: string;
  service: string;
  sector: string;
  industries: string[];
  listing_status: string;
  location: string;
  employee_count: string;
  revenue_band: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
