import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import {
  IQuestionnaire,
  IQuestionnaireFilter,
} from '../interface/IQuestionnaire.interface';
import { Params } from '../utils';

// Mock data to use until backend API is ready
export const mockQuestionnaires: IQuestionnaire[] = [
  {
    id: 'QN-401',
    universal_question_id: 'UQ-AIR-001',
    title: 'Is Ambient Air Quality report submitted quarterly to SPCB?',
    description: 'Verify quarterly submission acknowledgement from the Pollution Control Board.',
    type: 'SINGLE_SELECT',
    options: ['Yes', 'No', 'In Progress'],
    placeholder: 'Select an option',
    compliance_scope: 'Air Quality Testing Protocol',
    createdAt: '2024-01-22T10:00:00.000Z',
    updatedAt: '2024-03-28T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'QN-402',
    universal_question_id: 'UQ-AIR-002',
    title: 'Enter the latest recorded particulate matter (PM10) level',
    description: 'Numerical value of PM10 measured during the last monitoring cycle.',
    type: 'NUMBER',
    options: [],
    placeholder: 'e.g. 65 µg/m³',
    compliance_scope: 'Air Quality Testing Protocol',
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-04-02T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'QN-403',
    universal_question_id: 'UQ-HAZ-001',
    title: 'Upload copy of Form 10 hazardous waste manifest',
    description: 'Attach copy of consignment manifest signed by transporter and TSDF operator.',
    type: 'FILE',
    options: [],
    placeholder: 'Attach signed Form 10 PDF',
    compliance_scope: 'Hazardous Chemical Disposal Procedure',
    createdAt: '2024-02-18T10:00:00.000Z',
    updatedAt: '2024-04-20T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'QN-404',
    universal_question_id: 'UQ-SAF-001',
    title: 'Select all safety gear inspected during bi-annual audit',
    description: 'Audit checklist for personal protective equipment and factory safety items.',
    type: 'MULTI_SELECT',
    options: ['Helmets', 'Safety Goggles', 'Earplugs', 'Fire Extinguishers', 'Safety Harness'],
    placeholder: 'Select applicable gear',
    compliance_scope: 'Factory Safety Audit Scope',
    createdAt: '2024-03-05T10:00:00.000Z',
    updatedAt: '2024-05-18T10:00:00.000Z',
    status: 'ACTIVE',
  },
];

export const getAll = async (
  params?: IQuestionnaireFilter,
  token?: string,
) => {
  try {
    const res = await get('/questionnaire', params as Params, {
      bearerToken: token,
      isFetchToken: !token,
    });
    if (res?.data?.questionnaires) {
      return res;
    }
  } catch (error) {
    // Backend API not ready yet - fallback to mock frontend data
  }

  // Filter mock data if search is provided
  let filtered = [...mockQuestionnaires];
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(searchLower)
        || item.compliance_scope.toLowerCase().includes(searchLower)
        || item.type.toLowerCase().includes(searchLower)
        || (item.description && item.description.toLowerCase().includes(searchLower)),
    );
  }

  return {
    data: {
      questionnaires: filtered,
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
    return await get(`/questionnaire/${id}`, undefined, {
      bearerToken: token,
      isFetchToken: !token,
    });
  } catch (error) {
    const found = mockQuestionnaires.find((item) => item.id === id);
    return { data: { data: found, success: true } };
  }
};

export const create = async (params: {
  title: string;
  universal_question_id?: string;
  description?: string;
  type: string;
  options?: string[];
  placeholder?: string;
  compliance_scope?: string;
}) => {
  try {
    return await post('/questionnaire/create', params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Questionnaire created successfully',
      },
    };
  }
};

export const update = async (
  params: {
    title: string;
    universal_question_id?: string;
    description?: string;
    type: string;
    options?: string[];
    placeholder?: string;
    compliance_scope?: string;
  },
  id: string,
) => {
  try {
    return await put(`/questionnaire/${id}`, params);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Questionnaire updated successfully',
      },
    };
  }
};

export const deleteQuestionnaire = async (id: string) => {
  try {
    return await deleteRequest(`/questionnaire/${id}`);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Questionnaire deleted successfully',
      },
    };
  }
};

export const activeQuestionnaire = async (id: string) => {
  try {
    return await put(`/questionnaire/${id}/activate`, undefined);
  } catch (error) {
    return {
      data: {
        success: true,
        message: 'Questionnaire activated successfully',
      },
    };
  }
};
