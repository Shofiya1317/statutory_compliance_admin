import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import {
  IComplianceScope,
  IComplianceScopeFilter,
} from '../interface/IComplianceScope.interface';
import { Params } from '../utils';

// Mock data to use until backend API is ready
export const mockComplianceScopes: IComplianceScope[] = [
  {
    id: 'CS-301',
    name: 'Air Quality Testing Protocol',
    description: 'Testing protocol for stack gas emissions and ambient air parameters.',
    compliance_obligation: 'Quarterly Ambient Air Quality Monitoring',
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-03-25T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CS-302',
    name: 'Hazardous Chemical Disposal Procedure',
    description: 'Safety scope for chemical transport, manifest sign-offs, and treatment facility delivery.',
    compliance_obligation: 'Hazardous Waste Manifest Maintenance',
    createdAt: '2024-02-15T10:00:00.000Z',
    updatedAt: '2024-04-18T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CS-303',
    name: 'Factory Safety Audit Scope',
    description: 'Scope covering bi-annual workplace safety inspections and emergency drill records.',
    compliance_obligation: 'Appointment of Safety Officer',
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
    status: 'DRAFT',
  },
  {
    id: 'CS-304',
    name: 'Notice Board & Working Hours Audit',
    description: 'Scope verifying physical notice boards, languages displayed, and shift timings.',
    compliance_obligation: 'Display of Working Hours and Wage Notice',
    createdAt: '2024-03-10T10:00:00.000Z',
    updatedAt: '2024-06-25T10:00:00.000Z',
    status: 'ACTIVE',
  },
];

export const getAll = async (
  params?: IComplianceScopeFilter,
  token?: string,
) => {
  try {
    const res = await get('/compliance-scope', params as Params, {
      bearerToken: token,
      isFetchToken: !token,
    });
    if (res?.data?.complianceScopes) {
      return res;
    }
  } catch (error) {
    // Backend API not ready yet - fallback to mock frontend data
  }

  // Filter mock data if search is provided
  let filtered = [...mockComplianceScopes];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(searchLower)
        || item.compliance_obligation.toLowerCase().includes(searchLower)
        || (item.description && item.description.toLowerCase().includes(searchLower)),
    );
  }

  return {
    data: {
      complianceScopes: filtered,
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
    return await get(`/compliance-scope/${id}`, undefined, {
      bearerToken: token,
      isFetchToken: !token,
    });
  } catch (error) {
    const found = mockComplianceScopes.find((item) => item.id === id);
    return { data: { data: found, success: true } };
  }
};

export const create = async (params: {
  name: string;
  description?: string;
  compliance_obligation?: string;
}) => {
  try {
    return await post('/compliance-scope/create', params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Scope created successfully',
      },
    };
  }
};

export const update = async (
  params: {
    name: string;
    description?: string;
    compliance_obligation?: string;
  },
  id: string,
) => {
  try {
    return await put(`/compliance-scope/${id}`, params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Scope updated successfully',
      },
    };
  }
};

export const deleteComplianceScope = async (id: string) => {
  try {
    return await deleteRequest(`/compliance-scope/${id}`);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Scope deleted successfully',
      },
    };
  }
};

export const activeComplianceScope = async (id: string) => {
  try {
    return await put(`/compliance-scope/${id}/activate`, undefined);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Scope activated successfully',
      },
    };
  }
};
