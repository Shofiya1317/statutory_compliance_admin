import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: {
  sector_name: string;
  industries?: string[];
}) => post('/sector/create', params);

export const update = (
  params: {
    sector_name: string;
    industries?: string[];
  },
  id: string,
) => put(`/sector/${id}`, params);
export const getAll = (params: ISectorFilter, token?: string) => get('/sector', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/sector/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deleteSector = (id: string) => deleteRequest(`/sector/${id}`);

export const activeSector = (id: string) => put(`/sector/${id}/activate`, undefined);

export const uploadSector = (params: FormData) => post('/sector/upload', params, undefined, {
  contentType: 'multipart/form-data',
});
