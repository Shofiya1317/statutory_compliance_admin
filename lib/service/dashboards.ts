/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  get, post, put, deleteRequest,
} from '../axiosInstance';
// import { Params } from '../utils';

export const getDashboards = (token?: string) => get('/dashboard', undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const getDashboardByDepartment = (token: string, departmentId: string) => get(
  `/dashboard/${departmentId}`,
  // {
  //   limit: 1000,
  // },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

export const getDashboardByStandard = (token: string, standardId: string) => get(
  `/dashboard/standard/${standardId}`,
  {
    limit: 1000,
  },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

export const createDashboardWidgets = (
  // moduleId: string,
  // indicatorId: string,
  params: any,
) => post('/dashboard', params);

export const getDashboardWidgets = (token?: string) => get('/dashboard-widgets', { limit: 1000 }, undefined, {
  bearerToken: token,
  isFetchToken: !token,
});

export const updateDashboardWidgets = (
  dashboardId: string,
  params: {
  id: string[],
  name: string,
  sequence: number,
  tabs: [
    {
      id: string,
      name: string,
      number_of_blocks: [
        {
          id: string,
          number_of_columns: [
            {
              id: string,
              dashboard_type: string,
              chart_type: string,
              isStacked: true,
              isHorizontal: true,
              isMetric: true,
              isTimeSeries: true,
              latestData: true,
              dashboard_items: [
                {
                  id: string,
                  name: string,
                  filter: true,
                  filters: [
                    {
                      id: string,
                      public_question_id: string,
                      universal_question_id: string,
                      is_option: true
                    }
                  ],
                  combined_parameters: [
                    {
                      id: string,
                      name: string,
                      custom_parameters: [
                        {
                          id: string,
                          name: string,
                          questions: [
                            string
                          ],
                          macro_function: string,
                          unit: string,
                          legends: [
                            string
                          ],
                          label: [
                            string
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      sequence: 0
    }
  ]
},

) => put(
  `/dashboard/${dashboardId}`,
  params,
);

// export const getWidgets = (
//   token?: string,
// ) => get(
//   '/widgets',
//   {
//     limit: 1000,
//   },
//   undefined,
//   {
//     bearerToken: token,
//     isFetchToken: !token,
//   },
// );

export const deleteWidgetBlock = (
  widgetBlockId: string,
) => deleteRequest(
  `/dashboard/block/${widgetBlockId}`,
);

export const deleteWidgetColumn = (
  widgetColumnId: string,
) => deleteRequest(
  `/dashboard/column/${widgetColumnId}`,
);

export const deleteCustomParameter = (
  customParameterId: string,
) => deleteRequest(
  `/dashboard/custom_parameter/${customParameterId}`,
);
