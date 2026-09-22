/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { Params } from '../utils';
import { ISectorFilter } from '../interface/ISector.interface';

export const create = (params: Params) => post('/questions', params);

export const update = (params: Params, id: string) => put(`/questions/${id}`, params);
export const getAll = (params?: ISectorFilter, token?: string) => get('/questions', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});
export const getById = (id: string, token?: string) => get(`/questions/${id}`, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const deleteQuestion = (id: string) => deleteRequest(`/questions/${id}`);

export const deleteQuestionsOption = (id: string, data: { optionIds: string[], isDeleted: boolean }) => deleteRequest(`/questions/${id}/options`, null, data as unknown as Params);

export const uploadQuestions = (data: FormData) => post('/upload-excel', data, undefined, {
  contentType: 'multipart/form-data',
});

export function ParseArrayOfObjects(data: any) {
  let i: number;
  const { length } = Object.keys(data);
  const res: any = [];
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < length; i++) {
    const key: any = Object.keys(data)[i];
    const obj: any = {};
    obj[key] = Object.values(data)[i];
    res.push(obj);
  }
  return res;
}
