/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  get, post, put, deleteRequest,
} from '../axiosInstance';
// import { Params } from '../utils';

export const getModules = (params?: Record<string, any>, token?: string) => get('/modules', params, {
  isFetchToken: !token,
  bearerToken: token,
});

export const getModuleList = (token?: string) => get('/active_standard_modules', undefined, {
  isFetchToken: !token,
  bearerToken: token,
});

export const getModulesByStandardId = (standardId: string, token?: string) => get(
  `/standard_modules/${standardId}`,
  { limit: 1000 },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

export const getWidgetData = (token: string, moduleId: string) => get(
  `/widgets/${moduleId}`,
  {
    limit: 1000,
  },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

export const createWidgets = (
  moduleId: string,
  indicatorId: string,
  params: any,
) => post(`/widgets/module/${moduleId}/indicator/${indicatorId}`, params);

export const getWidgets = (token?: string) => get(
  '/widgets',
  {
    limit: 1000,
  },
  undefined,
  {
    bearerToken: token,
    isFetchToken: !token,
  },
);

export const updateWidget = (
  widgetId: string,
  indicatorId: string,
  moduleId: string,
  body: {
  sequence: number,
  number_of_blocks: [
    {
      id: string,
      number_of_columns: [
        {
          widget_type: string,
          chart_type: string,
          isStacked: true,
          isHorizontal: true,
          isMetric: true,
          widget_items: [
            {
              title: string,
              filter: true,
              combined_parameters: [
                {
                  name: string,
                  custom_parameters: [
                    {
                      name: string,
                      questions: [
                        string
                      ],
                      universal_questions: [
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
  department_id: string
},

) => put(
  `/widgets/${widgetId}/${moduleId}/${indicatorId}`,
  body,
);

export const deleteWidgetsByWidgetId = (widgetId: string) => deleteRequest(`/widgets/${widgetId}`);

export const deleteWidgetBlock = (
  widgetBlockId: string,
) => deleteRequest(
  `/widgets/widget_block/${widgetBlockId}`,
);

export const deleteWidgetColumn = (
  widgetColumnId: string,
) => deleteRequest(
  `/widgets/widget_column/${widgetColumnId}`,
);

export const deleteCustomParameter = (
  customParameterId: string,
) => deleteRequest(
  `/widgets/custom_parameter/${customParameterId}`,
);
