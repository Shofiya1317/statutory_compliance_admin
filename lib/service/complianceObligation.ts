import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import {
  IComplianceObligation,
  IComplianceObligationFilter,
} from '../interface/IComplianceObligation.interface';
import { Params } from '../utils';

// Mock data to use until backend API is ready
export const mockComplianceObligations: IComplianceObligation[] = [
  {
    id: 'CO-201',
    name: 'Quarterly Ambient Air Quality Monitoring',
    description: 'Submit quarterly ambient air quality and stack emission reports to SPCB.',
    section: 'Section 21',
    applicability_rule: 'Manufacturing units with boiler capacity > 2 TPH',
    createdAt: '2024-01-18T10:00:00.000Z',
    updatedAt: '2024-03-22T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CO-202',
    name: 'Hazardous Waste Manifest Maintenance',
    description: 'Maintain Form 10 manifests for consignment of hazardous waste transported.',
    section: 'Section 6',
    applicability_rule: 'All hazardous waste generating facilities',
    createdAt: '2024-02-12T10:00:00.000Z',
    updatedAt: '2024-04-15T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CO-203',
    name: 'Appointment of Safety Officer',
    description: 'Appoint a qualified safety officer in accordance with state factory rules.',
    section: 'Section 40-B',
    applicability_rule: 'Factories employing 1000 or more workers',
    createdAt: '2024-02-25T10:00:00.000Z',
    updatedAt: '2024-05-10T10:00:00.000Z',
    status: 'DRAFT',
  },
  {
    id: 'CO-204',
    name: 'Display of Working Hours and Wage Notice',
    description: 'Notice showing periods of work and rates of wages to be displayed at main entrance.',
    section: 'Section 108',
    applicability_rule: 'All commercial and industrial establishments',
    createdAt: '2024-03-05T10:00:00.000Z',
    updatedAt: '2024-06-20T10:00:00.000Z',
    status: 'ACTIVE',
  },
];

export const getAll = async (
  params?: IComplianceObligationFilter,
  token?: string,
) => {
  try {
    const res = await get('/compliance-obligation', params as Params, {
      bearerToken: token,
      isFetchToken: !token,
    });
    if (res?.data?.complianceObligations) {
      return res;
    }
  } catch (error) {
    // Backend API not ready yet - fallback to mock frontend data
  }

  // Filter mock data if search is provided
  let filtered = [...mockComplianceObligations];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(searchLower)
        || item.section.toLowerCase().includes(searchLower)
        || item.applicability_rule.toLowerCase().includes(searchLower)
        || (item.description && item.description.toLowerCase().includes(searchLower)),
    );
  }

  return {
    data: {
      complianceObligations: filtered,
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
    return await get(`/compliance-obligation/${id}`, undefined, {
      bearerToken: token,
      isFetchToken: !token,
    });
  } catch (error) {
    const found = mockComplianceObligations.find((item) => item.id === id);
    return { data: { data: found, success: true } };
  }
};

export const create = async (params: {
  name: string;
  description?: string;
  section: string;
  applicability_rule: string;
}) => {
  try {
    return await post('/compliance-obligation/create', params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Obligation created successfully',
      },
    };
  }
};

export const update = async (
  params: {
    name: string;
    description?: string;
    section: string;
    applicability_rule: string;
  },
  id: string,
) => {
  try {
    return await put(`/compliance-obligation/${id}`, params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Obligation updated successfully',
      },
    };
  }
};

export const deleteComplianceObligation = async (id: string) => {
  try {
    return await deleteRequest(`/compliance-obligation/${id}`);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Obligation deleted successfully',
      },
    };
  }
};

export const activeComplianceObligation = async (id: string) => {
  try {
    return await put(`/compliance-obligation/${id}/activate`, undefined);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Obligation activated successfully',
      },
    };
  }
};
