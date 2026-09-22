/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  deleteRequest, get, post, put, patch,
} from '../axiosInstance';
import { ISectorFilter } from '../interface/ISector.interface';
import { Params } from '../utils';

export const create = (params: {
  theme_id: string;
  industry_id: string;
  weightage: number;
}) => post('/theme-industries', params);

export const getAll = (params?: ISectorFilter, token?: string) => get('/theme-industries', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getById = (id: string, token?: string) => get(`/theme-industries/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const update = (
  params: {
    theme_id: string;
    industry_id: string;
    weightage: number
  },
  id: string,
) => put(`/theme-industries/${id}`, params);

export const deleteTheme = (id: string) => deleteRequest(`/theme-industries/${id}`);
