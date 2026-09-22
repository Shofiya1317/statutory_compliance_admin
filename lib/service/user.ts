import {
  deleteRequest, get, post, put,
} from '../axiosInstance';
import { IUserFilter } from '../interface/IUser.interface';
import { Params } from '../utils';

export const getCurrentUser = (token?: string | undefined) => get('/me', undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const getAllUsers = (params: IUserFilter, accessToken: string) => get('/', params as unknown as Params, {
  isFetchToken: false,
  bearerToken: accessToken,
});

export const updateCurrentUser = (params: {
  first_name: string;
  last_name: string;
  phone_number: string;
}) => put('/admin', params, undefined);

export const updateUserById = (
  params: {
    first_name: string;
    last_name: string;
    phone_number: string;
    role: 'ADMIN' | 'USER' | 'SUPERADMIN';
  },
  id: string,
) => put(`/${id}`, params, undefined);

export const changePassword = (params: {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}) => post('/change_password', params, undefined);

export const blockUser = (
  params: {
    reason: string;
  },
  id: string,
) => post(`/${id}/block`, params, undefined);

export const unBlockUser = (id: string) => post(`/${id}/unblock`, undefined, undefined);

export const deleteUser = (id: string) => deleteRequest(`/${id}`, undefined);

export const inviteUser = (params: {
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPERADMIN';
}) => post('/invite', params);

export const resetInvitation = (
  params: {
    email: string;
  },
  id: string,
) => post(`/${id}/resend_invitation`, params);

export const uploadAvator = (parmas: FormData) => post('/upload_avatar', parmas, undefined, {
  contentType: 'multipart/form-data',
});

export const deleteAvatar = () => deleteRequest('/delete_avatar');
