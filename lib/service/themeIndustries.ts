import {
  deleteRequest, get, post, patch,
} from '../axiosInstance';
import { Params } from '../utils';

interface ThemeIndustryParams {
  theme_id: string;
  industry_id: string;
  weightage?: number;
}

interface LinkIndustriesParams {
  industry_ids: string[];
}

export const create = (params: ThemeIndustryParams) => post('/theme-industries', params);

export const update = (params: ThemeIndustryParams, id: string) => patch(`/theme-industries/${id}`, params);

export const getAll = (params?: Params, token?: string) => get('/theme-industries', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/theme-industries/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deleteThemeIndustry = (id: string) => deleteRequest(`/theme-industries/${id}`);

export const linkIndustries = (id: string, params: LinkIndustriesParams) => post(`/theme-industries/${id}/industries`, params);

const ThemeIndustriesService = {
  create,
  update,
  getAll,
  getById,
  deleteThemeIndustry,
  linkIndustries,
};

export default ThemeIndustriesService;
