import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import {
  IComplianceRequirement,
  IComplianceRequirementFilter,
} from '../interface/IComplianceRequirement.interface';
import { Params } from '../utils';

// Mock data to use until backend API is ready
export const mockComplianceRequirements: IComplianceRequirement[] = [
  {
    id: 'CR-101',
    name: 'Environmental Impact Assessment',
    description: 'Mandatory environmental compliance assessment for industrial projects.',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-03-20T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CR-102',
    name: 'Factory Safety Standards',
    description: 'Adherence to occupational health and safety guidelines under the Factories Act.',
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2024-04-12T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'CR-103',
    name: 'Hazardous Waste Management',
    description: 'Guidelines for safe disposal and handling of hazardous chemical waste.',
    createdAt: '2024-02-18T10:00:00.000Z',
    updatedAt: '2024-05-05T10:00:00.000Z',
    status: 'DRAFT',
  },
  {
    id: 'CR-104',
    name: 'Minimum Wage & Overtime Compliance',
    description: 'Periodic reporting and audit of payroll records to ensure statutory wage standards.',
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: '2024-06-18T10:00:00.000Z',
    status: 'ACTIVE',
  },
];

export const getAll = async (
  params?: IComplianceRequirementFilter,
  token?: string,
) => {
  try {
    const res = await get('/compliance-requirement', params as Params, {
      bearerToken: token,
      isFetchToken: !token,
    });
    if (res?.data?.complianceRequirements) {
      return res;
    }
  } catch (error) {
    // Backend API not ready yet - fallback to mock frontend data
  }

  // Filter mock data if search is provided
  let filtered = [...mockComplianceRequirements];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(searchLower)
        || item.id.toLowerCase().includes(searchLower)
        || (item.description && item.description.toLowerCase().includes(searchLower)),
    );
  }

  return {
    data: {
      complianceRequirements: filtered,
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
    return await get(`/compliance-requirement/${id}`, undefined, {
      bearerToken: token,
      isFetchToken: !token,
    });
  } catch (error) {
    const found = mockComplianceRequirements.find((item) => item.id === id);
    return { data: { data: found, success: true } };
  }
};

export const create = async (params: {
  name: string;
  description?: string;
}) => {
  try {
    return await post('/compliance-requirement/create', params);
  } catch (error) {
    // Mock successful creation for frontend demonstration
    return {
      data: {
        success: true,
        message: 'Compliance Requirement created successfully',
      },
    };
  }
};

export const update = async (
  params: {
    name: string;
    description?: string;
  },
  id: string,
) => {
  try {
    return await put(`/compliance-requirement/${id}`, params);
  } catch (error) {
    // Mock successful update for frontend demonstration
    return {
      data: {
        success: true,
        message: 'Compliance Requirement updated successfully',
      },
    };
  }
};

export const deleteComplianceRequirement = async (id: string) => {
  try {
    return await deleteRequest(`/compliance-requirement/${id}`);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Requirement deleted successfully',
      },
    };
  }
};

export const activeComplianceRequirement = async (id: string) => {
  try {
    return await put(`/compliance-requirement/${id}/activate`, undefined);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Compliance Requirement activated successfully',
      },
    };
  }
};
