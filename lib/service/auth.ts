import { BASE_URL_USER, get, post } from '../axiosInstance';

export const signIn = (params: { email: string; password: string }) => post(
  '/signin',
  params,
  null,
  {
    isFetchToken: false,
  },
  undefined,
);

export const resetPassword = async (params: {
  token: string;
  password: string;
  password_confirmation: string;
}) => post(
  '/reset_password',
  {
    token: params.token,
    password: params.password,
    password_confirmation: params.password_confirmation,
  },
  null,
);

export const forgotPassword = async (params: { email: string }) => post(
  '/forget_password',
  {
    email: params.email,
  },
  null,
);

export const acceptInvitation = async (
  token: string,
  params: {
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    confirm_password: string;
    accept_terms_and_conditions: boolean;
  },
) => post(`/${token}/accept_invitation`, params, undefined);

export const verifyInvitation = async (token: string) => get(`/${token}/verify_invitation`, undefined, undefined, {
  isFetchToken: false,
});

export const slugVerify = (slug: string) => post(`/auth/slug/${slug}`, undefined, undefined, {
  isFetchToken: false,
  baseUrl: BASE_URL_USER,
});
