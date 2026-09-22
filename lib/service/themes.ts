import {
  deleteRequest, get, post, patch,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: { name: string; description: string }) => post('/themes', params);

export const update = (
  params: {
    name: string;
    description: string;
  },
  id: string,
) => patch(`/themes/${id}`, params);

export const getAll = (params?: ISectorFilter, token?: string) => get('/themes', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/themes/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deletemodule = (id: string) => deleteRequest(`/themes/${id}`);
