import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: { name: string; description: string }) => post('/sub-indicators', params);

export const update = (
  params: {
    name: string;
    description: string;
  },
  id: string,
) => put(`/sub-indicators/${id}`, params);
export const getAll = (params: ISectorFilter, token?: string) => get('/sub-indicators', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/sub-indicators/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deletesubindicators = (id: string) => deleteRequest(`/sub-indicators/${id}`);

export const activesubindicators = (id: string) => put(`/sub-indicators/${id}/activate`, undefined);

export const uploadsubindicators = (params: FormData) => post('/sub-indicators/upload', params);
