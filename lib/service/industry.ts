import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: {
  industry_name: string;
  description: string;
  sector?: string;
}) => post('/industry/create', params);

export const update = (
  params: {
    industry_name: string;
    description: string;
    sector?: string;
  },
  id: string,
) => put(`/industry/${id}`, params);
export const getAll = (params: ISectorFilter, token?: string) => get('/industry', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getOne = (id: string) => get(`/industry/${id}`);

export const deleteIndustry = (id: string) => deleteRequest(`/industry/${id}`);

export const activeIndustry = (id: string) => put(`/industry/${id}/activate`, undefined);

export const uploadIndustry = (params: FormData) => post('/industry/upload', params, undefined, {
  contentType: 'multipart/form-data',
});
