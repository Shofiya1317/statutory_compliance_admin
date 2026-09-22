import {
  get, post,
} from '../axiosInstance';
import { Params } from '../utils';

export const create = (formData: FormData) => post('/file-repo/create', formData, undefined, {
  contentType: 'multipart/form-data',
});

export interface IFileRepoFilter {
  company_name?: string;
  year?: string;
  report_name?: string;
  limit?: string;
  page?: string;
}

export const getAll = (
  params?: IFileRepoFilter,
  token?: string,
) => get('/file-repo/getall', params as Params, {
  bearerToken: token,
  isFetchToken: !token,
});
