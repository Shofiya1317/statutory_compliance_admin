/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  deleteRequest, get, post, put, patch,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const getActiveStandards = (token?: string) => get('/active_standards', undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

// 1
export const create = (params: FormData) => post('/standards', params, undefined, {
  contentType: 'multipart/form-data',
});

// 2
export const update = (
  params: {
    name: string;
    description: string;
    is_weightage: boolean;
    is_active: boolean;
  },
  id: string,
) => put(`/standards/${id}`, params);

// 3
export const getAll = (params: ISectorFilter, token?: string) => get('/standards', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getStandardById = (id: string, token?: string) => get(`/standards/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

// 4
export const getById = (
  id: string,
  token?: string,
  flag?: string,
  params?: ISectorFilter,
) => {
  const queryParams = new URLSearchParams();

  // Append flag
  if (flag) {
    queryParams.append('flag', flag);
  }

  // Append additional params like page, limit
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  return get(`/standards/${id}?${queryParams.toString()}`, undefined, {
    bearerToken: token,
    isFetchToken: !token,
  });
};

// 5
export const deleteStandards = (id: string) => deleteRequest(`/standards/${id}`);

interface CreateThemesParams {
  standard_id: string;
  themes: {
    name: string;
    description: string;
    sequence: number;
    weightage: number;
    master_theme_id: string;
    indicators: {
      name: string;
      sequence: number;
      weightage: number;
      description: string;
      master_indicator_id: string;
      questions: {
        title: string;
        sequence: number;
        weightage: number;
        description: string;
        question_type: string;
        placeholder: string;
        option_type: string;
        universal_question_id: string;
        master_question_id: string;
        min_range: number;
        max_range: number;

        options: {
          text: string;
          value: string;
          weightage: number;
          master_option_id: string;
        }[];

        mixed_questions?: {
          value_question_type: string;
          value_name: string;
          value_enum: string[];
          unit_name: string;
          unit_type: string;
          unit_enum: string[];
          master_mixed_question_id: string;
        }[];
      }[];
    }[];
  }[];
}

// 6
export const createThemes = (id: string, params: CreateThemesParams) => post(`/standards/${id}/themes`, params);

// 7
export const patchThemes = (id: string, params: CreateThemesParams) => patch(`/standards/${id}/themes`, params);

// 8
export const getQuestionsByStandardIndicator = (
  standardId: string,
  indicatorId: string,
  token?: string,
) => get(
  `/standards/${standardId}/indicators/${indicatorId}/questions`,
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

// 9
export const getQuestionById = (questionId: string, token?: string) => get(`/standards/questions/${questionId}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

interface QuestionRulesParams {
  indicator_id: string;
  question_id: string;
  rules: {
    id: string;
    parent_question_id: string;
    parent_question_option_id: string;
    parent_question_option_ids: string[];
    value: string;
    is_removed: boolean;
    sequence: number;
  }[];
}

// 10
export const addQuestionRules = (
  standardId: string,
  params: QuestionRulesParams,
) => post(`/standards/${standardId}/rules`, params);

// 11
export const getQuestionRules = (
  standardId: string,
  indicatorId: string,
  questionId: string,
  token?: string,
) => get(
  `/standards/${standardId}/indicators/${indicatorId}/questions/${questionId}/rules`,
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

// 12
export const deleteStandardRule = (standardId: string, ruleId: string) => deleteRequest(`/standards/${standardId}/rules/${ruleId}`);

export const getStandardThemes = (standardId: string, token?: string) => get(`/standards/standardthemes/${standardId}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

interface ThemeWeightageParams {
  standard_id: string;
  themes: {
    id?: string;
    master_theme_id?: string;
    weightage: number;
    sequence: number;
    indicators: {
      id?: string;
      master_indicator_id?: string;
      weightage: number;
      sequence: number;
      questions: {
        id?: string;
        master_question_id?: string;
        weightage: number;
        sequence: number;
      }[];
    }[];
  }[];
}

// 14
export const updateThemeWeightages = (
  standardId: string,
  params: ThemeWeightageParams,
) => patch(`/standards/${standardId}/themes/weightages`, params);

export const getStandardThemesList = (params?: ISectorFilter, token?: string) => get('/standard-themes', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

// 15 — Translate standard questions into target languages
export const translateStandard = (
  standardId: string,
  languages: string[],
  token?: string,
) => post(
  `/standards/${standardId}/translate`,
  { languages },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  } as any,
);

export const deleteStandardQuestion = (questionId: string, token?: string) => deleteRequest(`/standard-questions/${questionId}`);

export const deleteStandardIndicator = (indicatorId: string, token?: string) => deleteRequest(`/standard-indicators/${indicatorId}`);

export const deleteStandardTheme = (themeId: string, token?: string) => deleteRequest(`/standard-themes/${themeId}`);
