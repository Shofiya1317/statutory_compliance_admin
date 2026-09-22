import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: {
  name: string;
  description: string;
}) => post('/indicators', params);

export const update = (
  params: {
    name: string;
    description: string;
  },
  id: string,
) => put(`/indicators/${id}`, params);
export const getAll = (params?: ISectorFilter, token?: string) => get('/indicators', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/indicators/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deleteindicators = (id: string) => deleteRequest(`/indicators/${id}`);
