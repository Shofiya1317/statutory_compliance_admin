export interface IUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  created_by_type: 'ADMIN' | 'USER' | 'SUPERADMIN';
  created_by: string;
  refresh_token: string | null;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: string;
  role: {
    name: 'ADMIN' | 'USER' | 'SUPERADMIN';
  };
  confirmed_at: string;
  invitation_token: string | null;
  password_reset_on: string | null;
  invitation_token_sent_at: string;
  accept_terms_of_service: boolean;
  forget_password_token: string | null;
  forget_password_token_sent_at: string | null;
  last_login_at: string;
  block_reason: string | null;
  blocked_on: string | null;
  avatar_url: string | null;
}

export interface IUserFilter {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  role?: string;
  status?: string;
}
