import { get, post, put } from '../axiosInstance';
import { Params } from '../utils';

export const getAllAcounts = (params: Params, token: string) => get('/accounts', params, {
  isFetchToken: false,
  bearerToken: token,
});

export const getAccount = (id: string, token?: string) => get(`/accounts/${id}`, undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const blockAccount = (
  id: string,
  params: {
    reason: string;
  },
) => post(`/accounts/block/${id}`, params, undefined);

export const unBlockAccount = (id: string) => post(`/accounts/unblock/${id}`, undefined);

export const suspendAccount = (
  id: string,
  params: {
    reason: string;
  },
) => post(`/accounts/suspend/${id}`, params);

export const unSuspendAccount = (id: string) => post(`/accounts/unsuspend/${id}`, undefined);

export const createAccount = (params: {
  name: string;
  account_name: string;
  slug: string;
  phone_number: string;
  email: string;
}) => post('/accounts/invite', params, undefined);

export const resendInvitation = (params: { email: string; slug: string }) => post('/accounts/resendInvitation', params, undefined);

export const deleteAccount = (
  id: string,
  params: {
    reason: string;
  },
) => put(`/accounts/delete/${id}`, params);

export const reActivateAccount = (id: string) => put(`/accounts/reactivate/${id}`, undefined);

export const accontRoleConfig = (token?: string) => get('/accounts/config', undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const getAccountAccess = (id: string, token?: string) => get(`/accounts/${id}/roleAccess`, undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const updateAccountAccess = (
  id: string,
  params: {
    role: string;
    module: string;
    features: string[];
  },
) => put(`/accounts/${id}/role_access`, params);

export const getMasterRoles = (token?: string) => get('/master/roleAccess', undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const updateMasterRoles = (params: {
  role: string;
  module: string;
  features: string[];
}) => put('/master/roleAccess', params);

export const resetAccountRole = (id: string) => put(`/account/${id}/tenent_reset`, undefined);
