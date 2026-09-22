/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-assign-module-variable */

import { ActionType } from '@/components/types';
import moment from 'moment';
import { IUser } from './interface/IUser.interface';
import { IStandard } from './interface/IStandard.interface';
// import { IModules } from './interface/IModules.interface';

export interface Params {
  [key: string]: string | number | (string | number)[] | null;
}

export const buildQueryParams = (params?: Params | null): string => {
  if (params) {
    const queryParams: string[] = [];
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value?.toString().length) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item?.toString().length) {
              queryParams.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
              );
            }
          });
        } else {
          queryParams.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
          );
        }
      }
    });
    return queryParams.join('&');
  }
  return '';
};

export const convertToPascalCase = (data: string) => data
  ?.toLowerCase()
  ?.split(' ')
  ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  ?.join(' ');

export const stringToHexColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash += str.charCodeAt(i) * (i + 1);
  }
  const color = (hash % 0xffffff).toString(16).toUpperCase();
  return `#${'00000'.substring(0, 6 - color.length)}${color}`;
};

export const getSlugClass = (slugValid: boolean | null) => {
  if (slugValid === false) {
    return 'is-invalid';
  }
  if (slugValid === true) {
    return 'is-valid';
  }
  return '';
};

export const resetFilter = (
  router: any,
  resetForm: () => void,
  pathname: string,
) => {
  const query = buildQueryParams({}).toString();
  router.push(`${pathname}?${query}`);
  resetForm();
};

export const updateQueryParams = (
  updatedValue: Params,
  router: any,
  params: Params,
  pathname: string,
) => {
  const query = buildQueryParams({ ...params, ...updatedValue });
  const path = `${pathname}?${query}`;
  router.push(path);
};

export const applyFilter = (
  values: Params,
  router: any,
  params: Params,
  pathname: string,
) => updateQueryParams({ ...values, page: 1 }, router, params, pathname);

export const getStatusColor = (status: string, isBg: boolean) => {
  switch (status) {
    case 'DRAFT':
    case 'INVITED':
    case 'CREATED':
    case 'PROCESSING':
      return isBg ? 'bg-created' : 'pill bg-created';
    case 'IN_PROGRESS':
    case 'PUBLISHED':
    case 'PENDING':
      return isBg ? 'bg-inprogres' : 'pill bg-inprogres';
    case 'BLOCKED':
    case 'CANCELLED':
    case 'FAILED':
    case 'SUSPEND':
    case 'DELETED':
      return isBg ? 'bg-cancelled' : 'pill bg-cancelled';
    case 'ON_TRACK':
      return isBg ? 'bg-ontrack' : 'pill bg-ontrack';
    case 'EXPIRED':
      return isBg ? 'bg-onhold' : 'pill bg-onhold';
    case 'ON_HOLD':
      return isBg ? 'bg-onhold' : 'pill bg-onhold';
    case 'COMPLETED':
    case 'ACTIVE':
    case 'CLOSED':
    case 'PUBLISH':
      return isBg ? 'bg-successtwo' : 'pill bg-successtwo';
    default:
      return isBg ? 'bg-created' : 'pill bg-created';
  }
};

export const updateBuildQueryParams = (
  newParams: Record<string, string>,
  searchParams: URLSearchParams,
): URLSearchParams => {
  const params = new URLSearchParams(searchParams.toString());
  Object.keys(newParams).forEach((key) => {
    params.set(key, newParams[key]);
  });
  return params;
};

export const dateFormatForList = (value: string | null) => (value ? moment(value).format('lll') : '-');

export const convertExcel = (res: any, type: string) => {
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
  });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${type}_${new Date().getTime()}.xlsx`;
  link.click();
};

export const convertPdf = (res: any, type: string) => {
  const blob = new Blob([res], {
    type: 'application/pdf',
  });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${type}_${new Date().getTime()}.pdf`;
  link.click();
};

export const getDateRange = (searchKey: string, date?: Date) => {
  const today = moment(date || new Date());
  let fromDate: string = '';
  let toDate: string = '';

  const formatDate = (dateString: string) => moment(dateString).format('YYYY-MM-DD');
  // eslint-disable-next-line default-case
  switch (searchKey) {
    case 'today':
    case 'Today': {
      fromDate = formatDate(today.format());
      toDate = formatDate(today.format());
      break;
    }
    case 'yesterday':
    case 'Yesterday': {
      const yesterday = today.clone().subtract(1, 'day');
      fromDate = formatDate(yesterday.format());
      toDate = formatDate(yesterday.format());
      break;
    }
    case 'week':
    case 'Week': {
      fromDate = formatDate(today.clone().startOf('week').format());
      toDate = formatDate(today.clone().endOf('week').format());
      break;
    }
    case 'month':
    case 'Month': {
      fromDate = formatDate(today.clone().startOf('month').format());
      toDate = formatDate(today.clone().endOf('month').format());
      break;
    }
    case 'quarter': {
      fromDate = formatDate(today.clone().startOf('quarter').format());
      toDate = formatDate(today.clone().endOf('quarter').format());
      break;
    }
    case 'year':
    case 'Year': {
      fromDate = formatDate(today.clone().startOf('year').format());
      toDate = formatDate(today.clone().endOf('year').format());
      break;
    }
  }

  return { fromDate, toDate };
};

export const getUserData = (source: { user: IUser }) => ({
  user: {
    name: `${source?.user?.first_name} ${source?.user?.last_name}`,
    id: source?.user?.id,
    status: source?.user?.status,
    role: source?.user?.role,
  },
});

export function formatDateList(
  date: string | null,
  format = 'DD/MM/YYYY',
): string {
  return date ? moment(date).format(format) : '-';
}

export function groupBy(x: any, f: any) {
  return x.reduce(
    // eslint-disable-next-line no-sequences, no-return-assign, no-param-reassign
    (a: any, b: any, i: any) => ((a[f(b, i, x)] ||= []).push(b), a),
    {},
  );
}

export const btnName = (isSubmitting: boolean, actionType: ActionType) => {
  if (isSubmitting) {
    return actionType === 'Edit' ? 'Updating...' : 'Creating...';
  }
  return actionType === 'Edit' ? 'Save' : actionType;
};

export const findModules = (moduleId: string, standard: IStandard | any) => standard
  ?.standard_modules
  ?.find((item:any) => item?.master_module?.id === moduleId);

// export const findModules = (
//   moduleId: string,
//   modules: any,
// ) => modules?.find((item:any) => item?.id === moduleId);

export const findIndicator = (
  standard: IStandard,
  indicatorId: string,
  moduleId: string,
) => findModules(moduleId, standard)
  ?.standard_indicators
  ?.find(
    (item:any) => item?.master_indicator?.id === indicatorId,
  );

// export const findIndicator = (
//   modules: any,
//   moduleId: string,
//   indicatorId: string,
// ) => findModules(moduleId, modules)?.indicators?.find(
//   (item:any) => item?.id === indicatorId
// );

export const findIndicatorLinkModules = (
  standard: any,
  indicatorId: string,
  moduleId: string,
) => {
  const module = standard.standard_modules?.find(
    (mod:any) => mod.master_module?.id === moduleId,
  );

  if (!module) return null;

  return module.standard_indicators.find(
    (ind:any) => ind.master_indicator?.id === indicatorId,
  );
};

export const downloadErrors = (errors: any[]) => {
  const file = new Blob([JSON.stringify(errors, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'import-errors.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
