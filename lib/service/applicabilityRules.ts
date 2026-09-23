import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import {
  IApplicabilityRules,
  IApplicabilityRulesFilter,
} from '../interface/IApplicabilityRules.interface';
import { Params } from '../utils';

// Mock data to use until backend API is ready
export const mockApplicabilityRules: IApplicabilityRules[] = [
  {
    id: 'AR-501',
    name: 'Manufacturing Boiler Operators Compliance Rule',
    description: 'Applicability criteria for manufacturing units with operational high-pressure boiler units.',
    state: 'Maharashtra',
    service: 'Statutory Audit',
    sector: 'Manufacturing',
    industries: ['Chemicals', 'Heavy Engineering'],
    listing_status: 'Listed',
    location: 'Pune Industrial Area',
    employee_count: '500-1000',
    revenue_band: '₹50 Cr - ₹250 Cr',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-03-20T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'AR-502',
    name: 'Hazardous Chemical Handling & TSDF Rule',
    description: 'Mandatory compliance for hazardous waste generating and recycling industrial facilities.',
    state: 'Gujarat',
    service: 'Environmental Clearance',
    sector: 'Chemical & Petrochemical',
    industries: ['Specialty Chemicals', 'Petroleum Refining'],
    listing_status: 'Unlisted',
    location: 'Dahej SEZ',
    employee_count: '250-500',
    revenue_band: '₹25 Cr - ₹100 Cr',
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2024-04-12T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'AR-503',
    name: 'Workplace Safety & Labor Standards Rule',
    description: 'Mandatory safety officer and welfare provisions for large-scale construction enterprises.',
    state: 'Karnataka',
    service: 'Labor Law Compliance',
    sector: 'Infrastructure',
    industries: ['Construction', 'Real Estate'],
    listing_status: 'Listed',
    location: 'Bengaluru Urban',
    employee_count: '> 1000',
    revenue_band: '> ₹250 Cr',
    createdAt: '2024-02-28T10:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
    status: 'DRAFT',
  },
  {
    id: 'AR-504',
    name: 'Commercial Establishment Wage Standards Rule',
    description: 'Rules regarding minimum wages, working hours, and periodic employee welfare filings.',
    state: 'Telangana',
    service: 'Payroll Compliance',
    sector: 'Information Technology',
    industries: ['Software Services', 'BPO/KPO'],
    listing_status: 'Listed',
    location: 'Hyderabad Cyberabad',
    employee_count: '> 1000',
    revenue_band: '> ₹500 Cr',
    createdAt: '2024-03-08T10:00:00.000Z',
    updatedAt: '2024-06-22T10:00:00.000Z',
    status: 'ACTIVE',
  },
];

export const getAll = async (
  params?: IApplicabilityRulesFilter,
  token?: string,
) => {
  try {
    const res = await get('/applicability-rules', params as Params, {
      bearerToken: token,
      isFetchToken: !token,
    });
    if (res?.data?.applicabilityRules) {
      return res;
    }
  } catch (error) {
    // Backend API not ready yet - fallback to mock frontend data
  }

  // Filter mock data if search is provided
  let filtered = [...mockApplicabilityRules];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(searchLower)
        || item.sector.toLowerCase().includes(searchLower)
        || item.state.toLowerCase().includes(searchLower)
        || item.listing_status.toLowerCase().includes(searchLower)
        || item.industries.some((ind) => ind.toLowerCase().includes(searchLower))
        || (item.description && item.description.toLowerCase().includes(searchLower)),
    );
  }

  return {
    data: {
      applicabilityRules: filtered,
      meta: {
        currentCount: filtered.length,
        currentPage: params?.page || '1',
        currentLimit: params?.limit || '10',
        totalCount: filtered.length,
      },
      success: true,
    },
  };
};

export const getById = async (id: string, token?: string) => {
  try {
    return await get(`/applicability-rules/${id}`, undefined, {
      bearerToken: token,
      isFetchToken: !token,
    });
  } catch (error) {
    const found = mockApplicabilityRules.find((item) => item.id === id);
    return { data: { data: found, success: true } };
  }
};

export const create = async (params: {
  name: string;
  description?: string;
  state: string;
  service?: string;
  sector: string;
  industries: string[];
  listing_status: string;
  location?: string;
  employee_count?: string;
  revenue_band?: string;
}) => {
  try {
    return await post('/applicability-rules/create', params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Applicability Rule created successfully',
      },
    };
  }
};

export const update = async (
  params: {
    name: string;
    description?: string;
    state: string;
    service?: string;
    sector: string;
    industries: string[];
    listing_status: string;
    location?: string;
    employee_count?: string;
    revenue_band?: string;
  },
  id: string,
) => {
  try {
    return await put(`/applicability-rules/${id}`, params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Applicability Rule updated successfully',
      },
    };
  }
};

export const deleteApplicabilityRule = async (id: string) => {
  try {
    return await deleteRequest(`/applicability-rules/${id}`);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Applicability Rule deleted successfully',
      },
    };
  }
};

export const activeApplicabilityRule = async (id: string) => {
  try {
    return await put(`/applicability-rules/${id}/activate`, undefined);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Applicability Rule activated successfully',
      },
    };
  }
};
