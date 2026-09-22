import { IUser } from './IUser.interface';

export interface IAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  account_name: string;
  slug: string;
  email: string;
  company_website_url: string | null;
  official_email_id: string | null;
  cin_number: string | null;
  incorporated_year: string | null;
  industry_type: string | null;
  phone_number: string | null;
  api_key: string;
  onboarding: number;
  tax_id: string | null;
  address: string | null;
  status: string;
  invitation_send_at: string;
  invitation_token: string | null;
  reason: string | null;
  blocked_on: string | null;
  createdBy: IUser | null;
  blocked_by: string | null;
  avatar: string | null;
  suspend_by: string | null;
  suspend_on: string | null;
  suspend_reason: string | null;
  confirmed_at: string | null;
}

export interface IAccountFilter {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  status?: string;
}
