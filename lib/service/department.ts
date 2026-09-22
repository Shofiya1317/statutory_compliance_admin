import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: { name: string }) => post('/departments', params);

export const update = (
  params: {
    name: string;
  },
  id: string,
) => put(`/departments/${id}`, params);
export const getAll = (params: ISectorFilter, token?: string) => get('/departments', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/departments/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deleteDepartments = (id: string) => deleteRequest(`/departments/${id}`);
