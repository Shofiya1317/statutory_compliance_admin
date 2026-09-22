/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint no-shadow: off */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-useless-return */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType } from '@/components/types';
import {
  Field,
  FieldArray,
  FieldProps,
  Formik,
  // FormikHelpers
} from 'formik';
import React, { useEffect, useState, useMemo } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import * as Yup from 'yup';
import { FormikField } from '@/components/FormikField/FormikField';
import Button from '@/components/Button/Button';
import { btnName } from '@/lib/utils';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import {
  DashboardService,
  DepartmentService,
  WidgetService,
  StandardService,
} from '@/lib/service';
import { IStandard } from '@/lib/interface/IStandard.interface';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IDepartment } from '@/lib/interface/IDepartment.interface';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { isDataView } from 'util/types';
// import WidgetCard from '../MasterList/Widgets/WidgetCard';
// import WidgetTextArea from '../MasterList/Widgets/WidgetTextArea';
// import WidgetChart from '../MasterList/Widgets/WidgetChart';
// import WidgetTable from '../MasterList/Widgets/WidgetTable';

function AddOrEditDashboardWidgets({
  actionType,
  onClose,
  currentWidget,
  searchParams,
  widgetId,
  token,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentWidget?: any | undefined;
  searchParams?: any;
  widgetId?: string;
  token?: string;
}) {
  // console.log(actionType, 'actionType')
  // console.log(currentWidget, 'currentWidget');
  const [currentWidgetData, setCurrentWidgetData] =
    useState<any>(currentWidget);
  // console.log(
  //   'current widget-------------',
  //   JSON.stringify(currentWidget, null, 2)
  // );
  // const [widgetType, setWidgetType] = useState<{ [key: string]: string }>({});
  const [departmentsData, setDepartments] = useState<any>();
  const [selectedDepartment, setSelectedDepartment] = useState<any>();
  const [activeTabId, setActiveTabId] = useState<string>(
    currentWidgetData?.tabs?.[0]?.id || '',
  );
  const [activeTabName, setActiveTabName] = useState<string>(
    currentWidgetData?.tabs?.[0]?.name || '',
  );

  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<any>();
  const [indicators, setIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState<any>();
  const [filterQuestionsOptions, setFilterQuestionsOptions] = useState<any>([]);
  const [questions, setQuestions] = useState<any>([]);
  const [macroModule, setSelectedMacroModule] = useState<any>();
  const [macroIndicators, setMacroIndicators] = useState([]);
  const [macroSubIndicators, setMacroSubIndicators] = useState<any>();
  const [groupedQuestions, setGroupedQuestions] = useState<any>();
  const [macroQuestions, setMacroQuestions] = useState<any>([]);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>();
  const [macroDepartment, setSelectedMacroDepartment] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardOption, setDashboardOption] = useState<
    'department' | 'standard'
  >('department');
  const [computedFormulas, setComputedFormulas] = useState<any[][][][]>([]);

  const [formulaVersion, setFormulaVersion] = useState(0);

  // console.log(activeTabId, 'activeTabId');
  // console.log(activeTabName, 'activeTabName');

  const filterParams = {
    page: searchParams?.page || '1',
    limit: searchParams?.limit || '50',
    search: searchParams?.search || '',
    status: searchParams?.status || '',
    sort: searchParams?.sort || '-createdAt',
    sector_name: searchParams?.sector_name || '',
    industry_name: searchParams?.industry_name || '',
    industry_id: searchParams?.industry_id || '',
    module_name: searchParams?.module_name || '',
    module_id: searchParams?.module_id || '',
    question_type: searchParams?.question_type || '',
    standard_name: searchParams?.standard_name || '',
    standard_id: searchParams?.standard_id || '',
    indicator_name: searchParams?.indicator_name || '',
    indicator_id: searchParams?.indicator_id || '',
  };

  const getDepartments = async () => {
    const res = await DepartmentService.getAll(filterParams);
    const { success, departments, meta } = res?.data as {
      success: boolean;
      departments: IDepartment[];
      meta: IMeta;
    };
    if (success) {
      setDepartments(departments);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);
  const router = useRouter();

  // const getModules = async () => {
  //   const res = await WidgetService.getModulesByStandardId();
  //   const { success, data } = res?.data as {
  //     success: boolean;
  //     data: any;
  //   };
  //   // console.log(data, 'data----------------');
  //   // console.log('data----------------', JSON.stringify(data, null, 2));

  //   if (success) {
  //     setModules(data);
  //   }
  // };

  // useEffect(() => {
  //   getModules();
  // }, []);

  function groupQuestionsBySubindicator(questionsData: any[]) {
    const groups: Record<string, { subindicator: any; questions: any[] }> = {};
    questionsData.forEach((q) => {
      const subId = q.sub_indicator?.id;
      if (!groups[subId]) {
        groups[subId] = {
          subindicator: q.sub_indicator || 'NO_SUBINDICATOR',
          questions: [],
        };
      }
      groups[subId].questions.push(q);
    });
    return groups;
  }

  interface Option {
    label: string;
    value: string;
  }

  const [standardOptions, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchActiveStandards = async () => {
      try {
        const res = await StandardService.getActiveStandards();

        // Assuming res.data looks like:
        // { success: true, data: [ { id, name }, ... ] }

        const { success, data } = res?.data || {};

        if (success && Array.isArray(data)) {
          // Format options for your <Select>
          const formattedOptions = data.map((standard) => ({
            label: standard.name,
            value: standard.id,
          }));

          setOptions(formattedOptions);
        } else {
          console.warn('No active standards found or response invalid');
          setOptions([]);
        }
      } catch (error) {
        console.error('Error fetching active standards:', error);
        setOptions([]); // fallback
      }
    };

    fetchActiveStandards();
  }, []);

  // console.log(departmentsData)
  // console.log(JSON.stringify(departmentsData, null, 2), 'departmentsData');

  const [computedDeptFormulas, setComputedDeptFormulas] = useState<any[][][][]>(
    [],
  );

  useEffect(() => {
    const getDepartmentById = async () => {
      try {
        const res = await DepartmentService.getById(selectedDepartment || '');
        const { success, data } = res?.data as {
          success: boolean;
          data: any;
        };

        if (success) {
          setSelectedDepartmentData(data);
        } else {
          console.error('Error fetching department data');
        }
      } catch (err) {
        console.error('API error:', err);
      }
    };

    if (selectedDepartment) {
      getDepartmentById(); // ✅ call happens here, not inside function
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (!currentWidgetData) return;

    // If widget belongs to DEPARTMENT
    if (currentWidgetData.department && currentWidgetData.standard === null) {
      if (!departmentsData?.length || !activeTabId) return;

      const activeTab = currentWidgetData.tabs.find(
        (tab: any) => tab.id === activeTabId,
      );
      if (!activeTab) return;

      const deptFormulas: any[] = [];
      //       console.log('DEPARTMENT LOGGING START');
      // console.log('departmentsData:', departmentsData);
      // console.log('activeTab.dashboard_blocks:', activeTab?.dashboard_blocks);

      activeTab.dashboard_blocks?.forEach((block: any, blockIndex: number) => {
        block.dashboard_columns?.forEach((col: any, widgetIndex: number) => {
          col.dashboard_types?.forEach((type: any, typeIndex: number) => {
            type.dashboard_items?.forEach((item: any, itemIndex: number) => {
              item.dashboard_combined_parameters?.forEach(
                (param: any, combinedParamIndex: number) => {
                  param.dashboard_custom_parameters?.forEach(
                    (custom: any, customParamIndex: number) => {
                      const questionsArr = Array.isArray(custom?.questions)
                        ? custom.questions
                        : custom?.questions
                          ? [custom.questions]
                          : [];

                      questionsArr.forEach((questionId: string) => {
                        let departmentId = '';

                        departmentsData.forEach((dept: any) => {
                          dept.questions?.forEach((q: any) => {
                            // console.log(
                            //   'Checking questionId',
                            //   questionId,
                            //   'against',
                            //   q.universal_question_id
                            // );
                            if (q.universal_question_id === questionId) {
                              departmentId = dept.id;
                            }
                          });
                        });

                        const macro_function =
                          custom?.macro_function === questionId
                            ? questionId
                            : '';

                        deptFormulas.push({
                          tabId: activeTabId,
                          blockIndex,
                          widgetIndex,
                          typeIndex,
                          itemIndex,
                          combinedParamIndex,
                          customParamIndex,
                          department: departmentId,
                          questions: questionId,
                          macro_function,
                        });
                      });
                    },
                  );
                },
              );
            });
          });
        });
      });
      // console.log(deptFormulas, '----')
      setComputedDeptFormulas(deptFormulas);
      return; // ✅ stop here so standard logic doesn’t run
    }

    // If widget belongs to STANDARD
    if (currentWidgetData.standard && currentWidgetData.department === null) {
      // console.log('modules', modules);
      // console.log('activeTabId', activeTabId);

      if (!modules?.length || !activeTabId) return;

      const activeTab = currentWidgetData.tabs.find(
        (tab: any) => tab.id === activeTabId,
      );
      if (!activeTab) return;

      const formulas: any[] = [];

      activeTab.dashboard_blocks?.forEach((block: any, blockIndex: number) => {
        block.dashboard_columns?.forEach((col: any, widgetIndex: number) => {
          const widgetType = col.dashboard_types?.[0];

          widgetType?.dashboard_items?.forEach(
            (item: any, itemIndex: number) => {
              item.dashboard_combined_parameters?.forEach(
                (param: any, combinedParamIndex: number) => {
                  param.dashboard_custom_parameters?.forEach(
                    (custom: any, customParamIndex: number) => {
                      const questionsArr = Array.isArray(custom?.questions)
                        ? custom.questions
                        : custom?.questions
                          ? [custom.questions]
                          : [];

                      questionsArr.forEach((questionId: any) => {
                        let moduleId = '';
                        let indicatorId = '';
                        let subIndicatorId = '';

                        if (
                          col.dashboard_types?.[0]?.type?.toLowerCase() ===
                          'table'
                        ) {
                          modules.forEach((mod: any) => {
                            (mod.indicators ?? []).forEach((ind: any) => {
                              (ind.question_sequence ?? []).forEach(
                                (qs: any) => {
                                  const groupQuestions = Array.isArray(
                                    qs.group_questions,
                                  )
                                    ? qs.group_questions
                                    : qs.group_questions
                                      ? [qs.group_questions]
                                      : [];

                                  groupQuestions.forEach((gq: any) => {
                                    if (gq.id === questionId) {
                                      moduleId = mod.id;
                                      indicatorId = ind.id;
                                    }
                                  });
                                },
                              );
                            });
                          });
                        } else {
                          modules.forEach((mod: any) => {
                            mod.indicators?.forEach((ind: any) => {
                              ind.standard_questions?.forEach((q: any) => {
                                if (
                                  q.universal_question_id === questionId ||
                                  q.id === questionId
                                ) {
                                  moduleId = mod.id;
                                  indicatorId = ind.id;
                                  subIndicatorId = q.sub_indicator?.id || '';
                                }
                              });
                            });
                          });
                        }

                        if (moduleId && indicatorId) {
                          formulas.push({
                            tabId: activeTabId,
                            blockIndex,
                            widgetIndex,
                            itemIndex,
                            combinedParamIndex,
                            customParamIndex,
                            module: moduleId,
                            indicator: indicatorId,
                            questions: questionId,
                            subindicator: subIndicatorId || undefined,
                          });
                        } else {
                          console.warn(
                            '❌ No match found for questionId:',
                            questionId,
                          );
                        }
                      });
                    },
                  );
                },
              );
            },
          );
        });
      });

      // console.log('✅ Computed Standard Formulas:', formulas);

      setComputedFormulas(formulas);
    }
  }, [departmentsData, modules, currentWidgetData, activeTabId]);
  // console.log(computedDeptFormulas, 'formulas')
  // console.log(computedFormulas, 'formulas')
  const activeTabData = currentWidgetData?.tabs?.find(
    (t: any) => t.id === activeTabId,
  );

  // console.log(activeTabData, 'activeTabData');

  const mapDashboardBlocksToWidgetBlocks = (
    dashboardBlocks: any[],
    computedDeptFormulas: any[],
    tabId: string,
    dashboardType: 'standard' | 'department',
  ) =>
    dashboardBlocks
      ?.sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
      ?.map((block: any, blockIndex: number) => ({
        id: block?.id,
        sequence: block?.sequence || blockIndex,
        widget_columns: block.dashboard_columns
          ?.sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
          ?.map((col: any, widgetIndex: number) => ({
            id: col?.id,
            sequence: col?.sequence || widgetIndex,
            widget_type: col.dashboard_types?.[0]?.type || '',
            type_id: col.dashboard_types?.[0]?.type_id || '',
            chart_type: col.dashboard_types?.[0]?.chart_type || '',
            isStacked: col.dashboard_types?.[0]?.is_stacked || false,
            isHorizontal: col.dashboard_types?.[0]?.is_horizontal || false,
            isMetric: col.dashboard_types?.[0]?.is_metric || false,
            isTimeSeries: col.dashboard_types?.[0]?.is_time_series || false,
            isLastData: col.dashboard_types?.[0]?.is_last_data || false,
            widget_items: col.dashboard_types?.[0]?.dashboard_items.map(
              (item: any, itemIndex: number) => ({
                id: item?.id,
                title: item.title || '',
                filter: item.filter || false,
                filters:
                  item?.filter === true && Array.isArray(item.filters)
                    ? item.filters
                        ?.sort(
                          (a: any, b: any) =>
                            (a.sequence || 0) - (b.sequence || 0),
                        ) // ✅ sort filters
                        .map((f: any, filterIndex: number) => ({
                          id: f?.id ?? '',
                          public_question_id: f?.public_question?.id ?? '',
                          universal_question_id: f?.universal_question_id ?? '',
                          is_option: f?.is_option ?? false,
                          sequence: f?.sequence || filterIndex, // ✅ assign sequence fallback
                        }))
                    : [],
                combined_parameters: item.dashboard_combined_parameters.map(
                  (param: any, combinedParamIndex: number) => ({
                    id: param.id || '',
                    name: param.name || '',
                    sequence: param?.sequence || combinedParamIndex,
                    custom_parameters: param.dashboard_custom_parameters
                      ?.sort(
                        (a: any, b: any) =>
                          (a.sequence || 0) - (b.sequence || 0),
                      )
                      ?.map((cp: any, customParamIndex: number) => {
                        const formulasForMapping =
                          dashboardType === 'standard'
                            ? computedFormulas
                            : computedDeptFormulas;

                        const mappedFormulas =
                          formulasForMapping
                            ?.filter(
                              (f: any) =>
                                f.tabId === tabId &&
                                f.blockIndex === blockIndex &&
                                f.widgetIndex === widgetIndex &&
                                f.itemIndex === itemIndex &&
                                f.combinedParamIndex === combinedParamIndex &&
                                f.customParamIndex === customParamIndex,
                            )
                            .map((f: any) =>
                              (dashboardType === 'standard'
                                ? {
                                    module: f.module,
                                    indicator: f.indicator,
                                    subindicator: f.subindicator,
                                    questions: f.questions,
                                  }
                                : {
                                    department: f.department,
                                    questions: f.questions,
                                  })) || getInitialFormulas(dashboardType);

                        return {
                          id: cp.id || '',
                          name: cp.name || '',
                          sequence: cp?.sequence || customParamIndex,
                          formulas: mappedFormulas,
                          macro_function: cp.macro_function,
                          unit: cp.unit || '',
                          legends: cp.legends?.flat() || [''],
                          label: cp.label?.flat() || [''],
                        };
                      }),
                  }),
                ),
              }),
            ),
          })),
      })) || [];

  const getInitialFormulas = (dashboardOption: string) => {
    if (dashboardOption === 'standard') {
      return [
        {
          module: '',
          indicator: '',
          subindicator: '',
          questions: '',
        },
      ];
    }

    // default = department type
    return [
      {
        department: '',
        questions: '',
      },
    ];
  };

  const initialValues: any = useMemo(() => {
    if (currentWidgetData) {
      return {
        dashboard:
          currentWidgetData?.department != null ? 'department' : 'standard',
        department: currentWidgetData?.department?.id || '',
        standard: currentWidgetData?.standard?.id,
        name: currentWidgetData?.name || '',
        tab_name: activeTabName || '',
        tab_id: activeTabId || '',
        widget_blocks: mapDashboardBlocksToWidgetBlocks(
          activeTabData?.dashboard_blocks || [],
          currentWidgetData.standard ? computedFormulas : computedDeptFormulas,
          activeTabId,
          currentWidgetData.standard ? 'standard' : 'department', // <-- dashboardType
        ),
      };
    }

    return {
      dashboard: '',
      standard: '',
      department: '',
      tab_name: '',
      widget_blocks: [
        {
          widget_columns: [
            {
              widget_type: '',
              chart_type: '',
              isStacked: false,
              isHorizontal: false,
              isMetric: false,
              isTimeSeries: false,
              isLastData: false,
              isDataFilter: false,
              widget_items: [
                {
                  title: '',
                  filter: false,
                  filters: [],
                  combined_parameters: [
                    {
                      name: '',
                      custom_parameters: [
                        {
                          name: '',
                          formulas: getInitialFormulas(dashboardOption), // ✅ reacts to dashboardOption
                          unit: '',
                          macro_function: '',
                          legends: [''],
                          label: [''],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }, [
    currentWidgetData,
    dashboardOption,
    activeTabId,
    activeTabName,
    computedFormulas,
    computedDeptFormulas,
  ]);

  // console.log(initialValues, 'initialvalues')

  const validationSchema = Yup.object().shape({
    department: Yup.string(),
    // department: Yup.string().required('Department is required'),
    standard: Yup.string(),
    tab_name: Yup.string(),
    // tab_name: Yup.string().required('Tab Name is required'),
    widget_blocks: Yup.array()
      .of(
        Yup.object().shape({
          widget_columns: Yup.array()
            .of(
              Yup.object().shape({
                widget_type: Yup.string(),
                // widget_type: Yup.string().required('Widget Type is required'),
                chart_type: Yup.string(),
                isStacked: Yup.boolean(),
                isHorizontal: Yup.boolean(),
                isTimeSeries: Yup.boolean(),
                isLastData: Yup.boolean(),
                isDataFilter: Yup.boolean(),
                isMetric: Yup.boolean(),
                widget_items: Yup.array()
                  .of(
                    Yup.object().shape({
                      title: Yup.string(),
                      // title: Yup.string().required('Widget Title is required'),
                    }),
                  )
                  .min(1, 'At least one business unit is required'),
              }),
            )
            .min(1, 'At least one site is required'),
        }),
      )
      .min(1, 'At least one business unit is required'),
  });

  // const validationSchema = Yup.object().shape({
  //   department: Yup.string().required('Department is required'),
  //   tab_name: Yup.string().required('Tab Name is required'),
  //   widget_blocks: Yup.array()
  //     .of(
  //       Yup.object().shape({
  //         widget_columns: Yup.array()
  //           .of(
  //             Yup.object().shape({

  //               widget_type: Yup.string().required('Widget Type is required'),
  //               chart_type: Yup.string(),
  //               isStacked: Yup.boolean(),
  //               isHorizontal: Yup.boolean(),
  //               isTimeSeries: Yup.boolean(),
  //               isLastData: Yup.boolean(),
  //               isDataFilter: Yup.boolean(),
  //               isMetric: Yup.boolean(),
  //               widget_items: Yup.array()
  //                 .of(
  //                   Yup.object().shape({

  //                     title: Yup.string().required('Widget Title is required'),
  //                   }),
  //                 )
  //                 .min(1, 'At least one business unit is required'),
  //             }),
  //           )
  //           .min(1, 'At least one site is required'),
  //       }),
  //     )
  //     .min(1, 'At least one business unit is required'),
  // });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Widget Created Successfully!';
      case 'Edit':
        return 'Widget Updated Successfully!';
      default:
        return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastAndCloseModal = (res: any) => {
    const { success, error } = res?.data as {
      success: boolean;
      error: string[];
    };
    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const validateRequired = (values: any): string | null => {
    if (!values?.dasboard) {
      return 'Please select a dashboard type.';
    }
    if (values?.dashboard === 'department') {
      return 'Please select a department';
    }
    if (values?.dashboard === 'standard') {
      return 'Please select a standard';
    }
    if (!values?.tab_name) {
      return 'Please provide a tab name.';
    }

    for (const [blockIndex, block] of (values.widget_blocks || []).entries()) {
      for (const [colIndex, col] of (block.widget_columns || []).entries()) {
        if (!col.widget_type) {
          return `Please choose a widget type (Widget Block ${blockIndex + 1}, Widget ${colIndex + 1}).`;
        }

        for (const [itemIndex, item] of (col.widget_items || []).entries()) {
          if (!item.title) {
            return `Please enter a widget title (Widget Block ${blockIndex + 1}, Widget ${colIndex + 1}, Item ${itemIndex + 1}).`;
          }

          for (const [cpIndex, cp] of (
            item.combined_parameters || []
          ).entries()) {
            for (const [cIndex, c] of (cp.custom_parameters || []).entries()) {
              const formulas = c.formulas || [];

              // if (formulas.length === 0) {
              //   return `Please add at least one formula (Widget Block ${blockIndex + 1}, Widget ${colIndex + 1}, Custom Parameter ${cIndex + 1}).`;
              // }

              // ✅ Check each formula has questions
              for (const [fIndex, f] of formulas.entries()) {
                if (!f.questions || f.questions.trim() === '') {
                  return `Please select a question for (Widget Block ${blockIndex + 1}, Widget ${colIndex + 1}, Custom Parameter ${cIndex + 1}, Macro Parameter ${fIndex + 1} ).`;
                }
              }

              // ✅ Macro function check for all formulas except last
              // if (formulas.length > 1) {
              //   for (const [fIndex, f] of formulas.entries()) {
              //     if (fIndex < formulas.length - 1) {
              //       if (!f.macro_function || f.macro_function.trim() === '') {
              //         return `Please select a macro function (Widget Block ${blockIndex + 1}, Widget ${colIndex + 1}, Custom Parameter ${cIndex + 1}, Macro parameter ${fIndex + 1}).`;
              //       }
              //     }
              //   }
              // }
            }
          }
        }
      }
    }

    return null; // ✅ all fields are filled
  };

  const onSubmit = async (
    values: any,
    // { validateForm }: FormikHelpers<any>
  ) => {
    // const errorMsg = validateRequired(values);
    // if (errorMsg) {
    //   toast.error(errorMsg);
    //   return;
    // }

    let res;

    const params = {
      dashboards: [
        {
          name: '',
          department_id: values?.department?.trim() ? values.department : null,
          standard_id: values?.standard?.trim() ? values.standard : null,
          sequence: 0,
          tabs: [
            {
              name: values?.tab_name,
              number_of_tabs: 0,
              number_of_blocks: (values?.widget_blocks || []).map(
                (block: any) => ({
                  number_of_columns: (block?.widget_columns || []).map(
                    (columns: any) => ({
                      dashboard_type: columns?.widget_type,
                      chart_type: columns?.chart_type,
                      isStacked: columns?.isStacked,
                      isHorizontal: columns?.isHorizontal,
                      isTimeSeries: columns?.isTimeSeries,
                      isLastData: columns?.isLastData,
                      isMetric: columns?.isMetric,
                      dashboard_items: (columns?.widget_items || []).map(
                        (items: any) => ({
                          title: items?.title,
                          filter: items?.filter,
                          filters:
                            items?.filter === true &&
                            Array.isArray(items?.filters)
                              ? items.filters
                              : [], // ✅ always array
                          combined_parameters: (
                            items?.combined_parameters || []
                          ).map((combined: any) => ({
                            name: combined?.name ?? '',
                            custom_parameters: (
                              combined?.custom_parameters || []
                            ).map((custom: any) => ({
                              name: custom?.name ?? '',
                              questions: (custom?.formulas || []).map(
                                (formula: any) => formula.questions,
                              ),
                              // macro_function:
                              //   columns?.widget_type === 'textArea'
                              //     ? ''
                              //     : (custom?.formulas || [])
                              //         .filter((f: any) => f.questions)
                              //         .map(
                              //           (f: any, index: number, arr: any[]) => {
                              //             const hasOperator =
                              //               f.macro_function &&
                              //               f.macro_function !== '';
                              //             const isLast =
                              //               index === arr.length - 1;
                              //             return hasOperator && !isLast
                              //               ? `${f.questions} ${f.macro_function}`
                              //               : f.questions;
                              //           }
                              //         )
                              //         .join(' ') || '',
                              macro_function: custom?.macro_function ?? '',
                              unit: custom?.unit ?? '',
                              legends: Array.isArray(custom?.legends)
                                ? custom.legends
                                : custom?.legends
                                  ? [custom.legends]
                                  : [''],

                              label: Array.isArray(custom?.label)
                                ? custom.label
                                : custom?.label
                                  ? [custom.label]
                                  : [''],
                            })),
                          })),
                        }),
                      ),
                    }),
                  ),
                }),
              ),
            },
          ],
        },
      ],
    };

    const editParams: any = {
      id:
        values?.department && values.department.trim() !== ''
          ? [String(values.department)]
          : values?.standard
            ? [String(values.standard)]
            : [],
      name: String(values?.name ?? ''),
      sequence: 0,
      tabs: [
        {
          id: String(values?.tab_id ?? ''),
          name: String(values?.tab_name ?? ''),
          sequence: 0,
          number_of_blocks: (values?.widget_blocks ?? []).map((block: any) => ({
            id: String(block?.id ?? ''),
            sequence: block?.sequence,
            number_of_columns: (block?.widget_columns ?? []).map(
              (col: any) => ({
                id: String(col?.id ?? ''),
                sequence: col?.sequence,
                dashboard_type: String(col?.widget_type ?? ''),
                type_id: String(col?.type_id ?? ''),
                chart_type: String(col?.chart_type ?? ''),
                isStacked: col?.isStacked ?? false,
                isHorizontal: col?.isHorizontal ?? false,
                isMetric: col?.isMetric ?? false,
                isTimeSeries: col?.isTimeSeries ?? false,
                latestData: col?.isLastData ?? false,
                dashboard_items: (col?.widget_items ?? []).map((item: any) => ({
                  id: String(item?.id ?? ''),
                  name: String(item?.title ?? ''),
                  filter:
                    typeof item?.filter === 'boolean' ? item.filter : false,
                  filters: Array.isArray(item?.filters) ? item.filters : [],
                  combined_parameters: (item?.combined_parameters ?? []).map(
                    (cp: any) => ({
                      id: String(cp?.id ?? ''),
                      name: String(cp?.name ?? ''),
                      custom_parameters: (cp?.custom_parameters ?? []).map(
                        (c: any) => ({
                          id: String(c?.id ?? ''),
                          sequence: c?.sequence,
                          name: String(c?.name ?? ''),
                          questions: c?.formulas
                            ? c.formulas.map((f: any) => String(f.questions))
                            : [],
                          // macro_function: c?.formulas
                          //   ? c.formulas
                          //       .filter((f: any) => f.questions)
                          //       .map((f: any, i: number, arr: any[]) => {
                          //         const hasOperator =
                          //           f.macro_function && f.macro_function !== '';
                          //         const isLast = i === arr.length - 1;
                          //         return hasOperator && !isLast
                          //           ? `${f.questions} ${f.macro_function}`
                          //           : f.questions;
                          //       })
                          //       .join(' ')
                          //   : '',
                          macro_function: String(c?.macro_function ?? ''),
                          unit: String(c?.unit ?? ''),
                          legends: Array.isArray(c?.legends)
                            ? c.legends.map(String)
                            : c?.legends
                              ? [String(c.legends)]
                              : [],
                          label: Array.isArray(c?.label)
                            ? c.label.map(String)
                            : c?.label
                              ? [String(c.label)]
                              : [],
                        }),
                      ),
                    }),
                  ),
                })),
              }),
            ),
          })),
        },
      ],
    };
    switch (actionType) {
      case 'Create':
        // console.log(params, 'params');
        res = await DashboardService.createDashboardWidgets(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await DashboardService.updateDashboardWidgets(
          currentWidgetData?.id,
          editParams,
        );
        toastAndCloseModal(res);
        return;
      // eslint-disable-next-line no-fallthrough
      default:
        // eslint-disable-next-line consistent-return
        return null;
    }
  };

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    getTableData(tableData);
  }, [tableData]);

  const getTableData = (groups: any) => {
    if (!groups || groups.length === 0) return null;

    const columns = groups
      .flatMap(
        (group: any) => group.group_questions?.group_question_sequences || [],
      )
      .map((seq: any) => ({
        key: seq?.standard_question?.title || '',
        label: seq?.standard_question?.title?.toLocaleLowerCase() || '',
      }))
      .filter((col: any) => col.key && col.label); // remove empties
    const keyValue = [
      Object.fromEntries(columns.map((col: any) => [col.key, 'nil'])),
    ];

    // console.log(columns, 'columns inside getTableData');
    // console.log(keyValue, 'keyValue inside getTableData');
    // return (
    //   <WidgetTable
    //     key={columns.map((c: any) => c.key).join(',')}
    //     columns={columns}
    //     data={keyValue}
    //   />
    // );
  };
  // console.log(tableData, 'table')

  const getWidgetType = (WidgetData: any) => {
    const customParameters =
      WidgetData?.widget_items?.[0]?.combined_parameters?.[0]
        ?.custom_parameters;
    const labels = Array.from(
      new Set(customParameters?.map((item: any) => item.label)),
    );
    const legends = Array.from(
      new Set(customParameters?.map((item: any) => item.legends)),
    );
    // switch (WidgetData?.widget_type) {
    //   case 'card':
    //     return <WidgetCard cardData={WidgetData?.widget_items?.[0]} />;
    //   case 'textArea':
    //     return <WidgetTextArea cardData={WidgetData?.widget_items?.[0]} />;
    //   case 'chart':
    //     return (
    //       <WidgetChart
    //         title={WidgetData?.widget_items?.[0]?.title}
    //         isStacked={WidgetData?.isStacked}
    //         isHorizontal={WidgetData?.isHorizontal}
    //         isMetric={WidgetData?.isMetric}
    //         type={WidgetData?.chart_type}
    //         // Including Stacked Bar Chart
    //         categories={
    //           WidgetData?.chart_type === 'pie' ||
    //           WidgetData?.chart_type === 'donut' ||
    //           WidgetData?.chart_type === 'radialBar'
    //             ? WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters
    //                 ?.flatMap((item: any) => item.legends)
    //                 .filter((legend: any) => legend.trim() !== '')
    //             : WidgetData?.chart_type === 'bar' &&
    //                 WidgetData?.isStacked === true
    //               ? labels?.filter(
    //                   (label: any) =>
    //                     typeof label === 'string' && label.trim() !== ''
    //                 )
    //               : WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters
    //                   ?.flatMap((item: any) => item.label)
    //                   .filter(
    //                     (label: any) =>
    //                       typeof label === 'string' && label.trim() !== ''
    //                   )
    //         }
    //         // Including Stacked Bar Chart
    //         series={
    //           WidgetData?.chart_type === 'pie' ||
    //           WidgetData?.chart_type === 'donut' ||
    //           WidgetData?.chart_type === 'radialBar'
    //             ? customParameters.map((item: any) => item?.answer ?? 50) // Pie, donut, radialBar => flat series
    //             : WidgetData?.chart_type === 'bar' &&
    //                 WidgetData?.isStacked === true
    //               ? legends.map((legend) => ({
    //                   name: legend,
    //                   data: labels.map((label) => {
    //                     const match = customParameters.find(
    //                       (item: any) =>
    //                         item.label === label && item.legends === legend
    //                     );
    //                     return match?.answer ?? 50; // fallback if answer is missing
    //                   }),
    //                 }))
    //               : customParameters?.map((item: any) => ({
    //                   name: item?.legends,
    //                   data: item?.answer ? [item?.answer] : [50],
    //                 }))
    //         }
    //         // categories={WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters
    //         //   ?.flatMap((item: any) => item.label)
    //         //   .filter((label: any) => label.trim() !== '')}

    //         // categories={
    //         //   WidgetData?.chart_type === 'pie'
    //         //   || WidgetData?.chart_type === 'donut'
    //         //   || WidgetData?.chart_type === 'radialBar'
    //         //     ? WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters
    //         //         ?.flatMap((item: any) => item.legends)
    //         //         .filter((legend: any) => legend.trim() !== '')
    //         //     : WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters
    //         //         ?.flatMap((item: any) => item.label)
    //         //         .filter(
    //         //           (label: any) => typeof label === 'string' && label.trim() !== '',
    //         //         )
    //         // }

    //         // series={WidgetData?.widget_items?.[0]?.combined_parameters?.[0]?.custom_parameters?.map(
    //         //   (item: any) => {
    //         //     const seriesObj = {
    //         //       name: item?.legends,
    //         //       data: item?.answer ? [item?.answer] : [50],
    //         //     };
    //         //     if (
    //         //       WidgetData?.chart_type === 'pie'
    //         //       || WidgetData?.chart_type === 'donut'
    //         //     ) {
    //         //       return item?.answer ? [item?.answer] : 50;
    //         //     }
    //         //     if (WidgetData?.chart_type === 'radialBar') {
    //         //       return item?.answer ? [item?.answer] : [50];
    //         //     }
    //         //     return seriesObj;
    //         //   },
    //         // )}
    //       />
    //     );
    //   // case 'table':
    //   //   return (
    //   //     <WidgetTable
    //   //       columns={socialImpactProjectsColumn}
    //   //       data={socialImpactProjectsData}
    //   //     />
    //   //   );
    // }
  };

  const reloadWidgets = async (widgetId?: string) => {
    try {
      const res = await DashboardService.getDashboards(token);
      const { success, data } = res?.data as {
        success: boolean;
        data: any[];
      };

      if (success) {
        const widget = data.find((w) => w.id === widgetId);
        if (widget) {
          setCurrentWidgetData(widget);
        }
      }
    } catch (error) {
      console.error('Error reloading widgets:', error);
    }
  };

  useEffect(() => {
    if (!activeTabId) return;
    // do your formulas or mapping here
  }, [activeTabId]);

  // console.log(modules, 'modules')

  useEffect(() => {
    if (currentWidgetData) {
      setSelectedDepartment(currentWidgetData?.department?.id);
    }
  }, [currentWidgetData]);

  const tabOptions = currentWidgetData?.tabs?.map((tab: any) => ({
    label: tab.name,
    value: tab.id,
  }));

  // <pre>{JSON.stringify(values, null, 2)}</pre>

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        resetForm,
        values,
        setFieldValue,
      }) => {
        useEffect(() => {
          if (
            !activeTabId ||
            !computedDeptFormulas.length ||
            !computedFormulas.length ||
            !currentWidgetData
          ) {
            return;
          }

          const activeTab = currentWidgetData.tabs.find(
            (t: any) => t.id === activeTabId,
          );
          if (!activeTab) return;

          setFieldValue(
            'widget_blocks',
            mapDashboardBlocksToWidgetBlocks(
              activeTab.dashboard_blocks || [],
              currentWidgetData.standard
                ? computedFormulas
                : computedDeptFormulas,
              activeTabId,
              currentWidgetData.standard ? 'standard' : 'department',
            ),
            false,
          );
        }, [
          activeTabId,
          computedDeptFormulas,
          computedFormulas,
          currentWidgetData,
          setFieldValue,
        ]);

        useEffect(() => {
          if (values?.standard !== null) {
            const fetchModules = async () => {
              try {
                const response = await WidgetService.getModulesByStandardId(
                  values?.standard,
                );
                const { success, data } = response?.data as {
                  success: boolean;
                  data: any;
                };

                if (success) {
                  setModules(data);
                }
              } catch (err) {
                console.error('Error fetching modules:', err);
              }
            };

            fetchModules();
          }
        }, [values?.standard]);

        return (
          <form onSubmit={handleSubmit}>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            <Row>
              <Col className="mt-3">
                <Field name="dashboard">
                  {({ field }: FieldProps<string>) => (
                    <CustomInputField
                      validationSchema={validationSchema}
                      label="Dashboard"
                      error={errors.department as string}
                      field={field}
                      isCustomRequired
                    >
                      <Field
                        name={field.name}
                        component={CustomSelect}
                        id={field.name}
                        onChange={(e: any) => {
                          const selectedValue = e?.value;

                          // update local state
                          // setDashboardOption(selectedValue);

                          // update Formik field
                          setFieldValue(field.name, selectedValue);

                          // reset entire form with new initial values
                          resetForm({
                            values: {
                              ...initialValues,
                              dashboard: selectedValue,
                              widget_blocks: [
                                {
                                  widget_columns: [
                                    {
                                      widget_type: '',
                                      chart_type: '',
                                      isStacked: false,
                                      isHorizontal: false,
                                      isMetric: false,
                                      isTimeSeries: false,
                                      isLastData: false,
                                      isDataFilter: false,
                                      widget_items: [
                                        {
                                          title: '',
                                          filter: false,
                                          filters: [],
                                          combined_parameters: [
                                            {
                                              name: '',
                                              custom_parameters: [
                                                {
                                                  name: '',
                                                  formulas:
                                                    getInitialFormulas(
                                                      selectedValue,
                                                    ),
                                                  unit: '',
                                                  macro_function: '',
                                                  legends: [''],
                                                  label: [''],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          });
                        }}
                        value={values.dashboard}
                        options={[
                          { label: 'Standard', value: 'standard' },
                          { label: 'Department', value: 'department' },
                        ]}
                      />
                    </CustomInputField>
                  )}
                </Field>
              </Col>
            </Row>
            {values.dashboard === 'standard' && (
              <Row>
                <Col className="mt-3">
                  <Field name="standard">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Standard"
                        error={errors.department as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          name={field.name}
                          component={CustomSelect}
                          id={field.name}
                          onChange={async (e: any) => {
                            const selectedValue = e?.value;
                            // Update the form field value first
                            setFieldValue(field.name, selectedValue);
                            // try {
                            //   // replace with how you store your token (e.g. from context, localStorage)
                            //   const response = await WidgetService.getModulesByStandardId(values?.standard);
                            //   const { success, data } = response?.data as {
                            //     success: boolean;
                            //     data: any;
                            //   };

                            //   if (success) {
                            //     setModules(data);
                            //   }

                            // } catch (err) {
                            //   console.error("Error fetching modules:", err);
                            // }
                          }}
                          value={values.standard}
                          options={standardOptions}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>
            )}
            {(values.dashboard === 'department' || values.dashboard === '') && (
              <Row>
                <Col className="mt-3">
                  <Field name="department">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Department"
                        error={errors.department as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          name={field.name}
                          component={CustomSelect}
                          id={field.name}
                          onFieldUpdate={(e: any) => {
                            // const selectedDepartmentId = e?.value;
                            setSelectedDepartment(e?.value);
                            setFieldValue(field.name, e?.value);
                            // const dashboardDepartment = departments.find(
                            //   (module: any) => module.id === selectedDepartmentId
                            // );
                          }}
                          // onChange={(e: any) => {
                          //   setFieldValue(field.name, e?.value);
                          // }}
                          value={values.department}
                          options={departmentsData?.map((department: any) => ({
                            label: department.name,
                            value: department.id,
                          }))}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>
            )}
            <Row className="mt-2">
              <Col>
                {currentWidgetData ? (
                  <Field name="tab_id">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Tab Name"
                        error={errors.tab_id as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          name={field.name}
                          id={field.name}
                          component={CustomSelect}
                          options={tabOptions} // [{ label, value }]
                          value={
                            tabOptions.find(
                              (opt: any) => opt.value === values.tab_id,
                            ) || null
                          } // use entire option object
                          onFieldUpdate={(e: any) => {
                            const selectedTabId = e?.value;
                            setFieldValue(field.name, selectedTabId);
                            setActiveTabId(selectedTabId);

                            const selectedTab = currentWidgetData?.tabs.find(
                              (tab: any) => tab.id === selectedTabId,
                            );
                            if (selectedTab) {
                              setFieldValue(
                                'widget_blocks',
                                mapDashboardBlocksToWidgetBlocks(
                                  selectedTab.dashboard_blocks || [],
                                  currentWidgetData.standard
                                    ? computedFormulas
                                    : computedDeptFormulas,
                                  selectedTab.id,
                                  currentWidgetData.standard
                                    ? 'standard'
                                    : 'department',
                                ),
                                false,
                              );
                              setActiveTabName(selectedTab?.name);
                            }
                          }}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                ) : (
                  <FormikField
                    name="tab_name"
                    type="text"
                    validationSchema={validationSchema}
                    label="Tab Name"
                    errors={errors?.tab_name as any}
                    autoFocus
                    placeholder="Enter Tab Name"
                    isCustomRequired
                    customErrorMap=""
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <FieldArray name="widget_blocks">
                  {({ push: addBusinessUnit, remove: removeBusinessUnit }) => (
                    <div>
                      {values.widget_blocks.map(
                        (block: any, blockIndex: any) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={blockIndex}
                            className=" p-3 border rounded-1 bg-light mb-5 position-relative animated-element mt-3"
                          >
                            <div className=" text-capitalize pb-2 fw-bold">{`Widget Block ${blockIndex + 1}`}</div>
                            <FieldArray
                              name={`widget_blocks.${blockIndex}.widget_columns`}
                            >
                              {({ push: addSite, remove: removeSite }) =>
                                block.widget_columns?.map(
                                  (widget: any, widgetIndex: any) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <div className=" border p-3 mb-3 rounded-1 site-bg animated-element">
                                      <div className=" text-capitalize pb-2 fw-bold">{`Widget ${widgetIndex + 1}`}</div>

                                      <div className="row  position-relative">
                                        <div className="col-12 col-lg-12">
                                          <Field
                                            name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_type`}
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={widgetIndex}
                                          >
                                            {({
                                              field,
                                            }: FieldProps<string>) => (
                                              <CustomInputField
                                                validationSchema={
                                                  validationSchema
                                                }
                                                label="Widget Type"
                                                error={
                                                  errors.indicator as string
                                                }
                                                field={field}
                                                isCustomRequired
                                              >
                                                <Field
                                                  name={field.name}
                                                  component={CustomSelect}
                                                  id={field.name}
                                                  onChange={(e: any) => {
                                                    setFieldValue(
                                                      field.name,
                                                      e?.value,
                                                    );
                                                  }}
                                                  value={
                                                    values.widget_blocks?.[
                                                      blockIndex
                                                    ]?.widget_columns?.[
                                                      widgetIndex
                                                    ]?.widget_type
                                                  }
                                                  options={[
                                                    {
                                                      label: 'Card',
                                                      value: 'card',
                                                    },
                                                    {
                                                      label: 'TextArea',
                                                      value: 'textArea',
                                                    },
                                                    {
                                                      label: 'Chart',
                                                      value: 'chart',
                                                    },
                                                    {
                                                      label: 'Table',
                                                      value: 'table',
                                                    },
                                                  ]}
                                                />
                                              </CustomInputField>
                                            )}
                                          </Field>

                                          {/* Conditionally render chart fields based on Formik value */}
                                          {values.widget_blocks?.[blockIndex]
                                            ?.widget_columns?.[widgetIndex]
                                            ?.widget_type === 'chart' && (
                                            <div className="row mt-2">
                                              <div className="col-lg-6">
                                                <Field
                                                  name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.chart_type`}
                                                  // eslint-disable-next-line react/no-array-index-key
                                                  key={widgetIndex}
                                                >
                                                  {({
                                                    field,
                                                  }: FieldProps<string>) => (
                                                    <CustomInputField
                                                      validationSchema={
                                                        validationSchema
                                                      }
                                                      label="Chart Type"
                                                      error={
                                                        errors.indicator as string
                                                      }
                                                      field={field}
                                                    >
                                                      <Field
                                                        name={field.name}
                                                        component={CustomSelect}
                                                        id={field.name}
                                                        onChange={(e: any) => {
                                                          setFieldValue(
                                                            field.name,
                                                            e?.value,
                                                          );
                                                        }}
                                                        value={
                                                          values
                                                            .widget_blocks?.[
                                                            blockIndex
                                                          ]?.widget_columns?.[
                                                            widgetIndex
                                                          ]?.widget_type
                                                        }
                                                        options={[
                                                          {
                                                            label: 'Bar',
                                                            value: 'bar',
                                                          },
                                                          {
                                                            label: 'Line',
                                                            value: 'line',
                                                          },
                                                          {
                                                            label: 'Area',
                                                            value: 'area',
                                                          },
                                                          {
                                                            label: 'Pie',
                                                            value: 'pie',
                                                          },
                                                          {
                                                            label: 'Donut',
                                                            value: 'donut',
                                                          },
                                                          {
                                                            label: 'RadialBar',
                                                            value: 'radialBar',
                                                          },
                                                        ]}
                                                      />
                                                    </CustomInputField>
                                                  )}
                                                </Field>
                                              </div>
                                              {values.widget_blocks?.[
                                                blockIndex
                                              ]?.widget_columns?.[widgetIndex]
                                                ?.chart_type === 'bar' && (
                                                <>
                                                  <div className="col-lg-3">
                                                    <Field
                                                      name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.isStacked`}
                                                    >
                                                      {({
                                                        field,
                                                      }: FieldProps<string>) => (
                                                        <CustomInputField
                                                          validationSchema={
                                                            validationSchema
                                                          }
                                                          label="Stacked"
                                                          error={
                                                            errors.indicator as string
                                                          }
                                                          field={field}
                                                        >
                                                          <Field
                                                            name={field.name}
                                                            component={
                                                              CustomSelect
                                                            }
                                                            id={field.name}
                                                            onChange={(
                                                              e: any,
                                                            ) => {
                                                              setFieldValue(
                                                                field.name,
                                                                e?.value,
                                                              );
                                                            }}
                                                            value={
                                                              values
                                                                .widget_blocks?.[
                                                                blockIndex
                                                              ]
                                                                ?.widget_columns?.[
                                                                widgetIndex
                                                              ]?.isStacked
                                                            }
                                                            options={[
                                                              {
                                                                label: 'Yes',
                                                                value: true,
                                                              },
                                                              {
                                                                label: 'No',
                                                                value: false,
                                                              },
                                                            ]}
                                                          />
                                                        </CustomInputField>
                                                      )}
                                                    </Field>
                                                  </div>
                                                  <div className="col-lg-3">
                                                    <Field
                                                      name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.isHorizontal`}
                                                    >
                                                      {({
                                                        field,
                                                      }: FieldProps<string>) => (
                                                        <CustomInputField
                                                          validationSchema={
                                                            validationSchema
                                                          }
                                                          label="Horizontal"
                                                          error={
                                                            errors.indicator as string
                                                          }
                                                          field={field}
                                                        >
                                                          <Field
                                                            name={field.name}
                                                            component={
                                                              CustomSelect
                                                            }
                                                            id={field.name}
                                                            onChange={(
                                                              e: any,
                                                            ) => {
                                                              setFieldValue(
                                                                field.name,
                                                                e?.value,
                                                              );
                                                            }}
                                                            value={
                                                              values
                                                                .widget_blocks?.[
                                                                blockIndex
                                                              ]
                                                                ?.widget_columns?.[
                                                                widgetIndex
                                                              ]?.isHorizontal
                                                            }
                                                            options={[
                                                              {
                                                                label: 'Yes',
                                                                value: true,
                                                              },
                                                              {
                                                                label: 'No',
                                                                value: false,
                                                              },
                                                            ]}
                                                          />
                                                        </CustomInputField>
                                                      )}
                                                    </Field>
                                                  </div>
                                                </>
                                              )}

                                              {/* Add more chart-specific fields as needed */}
                                            </div>
                                          )}
                                        </div>
                                        {widget.widget_items?.map(
                                          (
                                            widgetItem: any,
                                            widgetItemIndex: any,
                                          ) => (
                                            <div
                                              className="row mt-2"
                                              // eslint-disable-next-line react/no-array-index-key
                                              key={widgetItemIndex}
                                            >
                                              <div className="col-12 col-lg-12">
                                                <FormikField
                                                  name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.title`}
                                                  type="text"
                                                  validationSchema={
                                                    validationSchema
                                                  }
                                                  label="Widget Title"
                                                  // errors={errors}
                                                  errors={
                                                    Array.isArray(
                                                      errors?.widget_blocks,
                                                    ) &&
                                                    errors?.widget_blocks[
                                                      blockIndex
                                                    ] &&
                                                    typeof errors.widget_blocks[
                                                      blockIndex
                                                    ] === 'object' &&
                                                    Array.isArray(
                                                      (
                                                        errors.widget_blocks[
                                                          blockIndex
                                                        ] as any
                                                      ).widget_columns,
                                                    ) &&
                                                    (
                                                      errors.widget_blocks[
                                                        blockIndex
                                                      ] as any
                                                    ).widget_columns[
                                                      widgetIndex
                                                    ] &&
                                                    typeof (
                                                      errors.widget_blocks[
                                                        blockIndex
                                                      ] as any
                                                    ).widget_columns[
                                                      widgetIndex
                                                    ] === 'object' &&
                                                    Array.isArray(
                                                      (
                                                        (
                                                          errors.widget_blocks[
                                                            blockIndex
                                                          ] as any
                                                        ).widget_columns[
                                                          widgetIndex
                                                        ] as any
                                                      ).widget_items,
                                                    ) &&
                                                    (
                                                      (
                                                        errors.widget_blocks[
                                                          blockIndex
                                                        ] as any
                                                      ).widget_columns[
                                                        widgetIndex
                                                      ] as any
                                                    ).widget_items[
                                                      widgetItemIndex
                                                    ] &&
                                                    typeof (
                                                      (
                                                        errors.widget_blocks[
                                                          blockIndex
                                                        ] as any
                                                      ).widget_columns[
                                                        widgetIndex
                                                      ] as any
                                                    ).widget_items[
                                                      widgetItemIndex
                                                    ] === 'object' &&
                                                    (
                                                      (
                                                        (
                                                          errors.widget_blocks[
                                                            blockIndex
                                                          ] as any
                                                        ).widget_columns[
                                                          widgetIndex
                                                        ] as any
                                                      ).widget_items[
                                                        widgetItemIndex
                                                      ] as any
                                                    ).title
                                                      ? (
                                                          (
                                                            (
                                                              errors
                                                                .widget_blocks[
                                                                blockIndex
                                                              ] as any
                                                            ).widget_columns[
                                                              widgetIndex
                                                            ] as any
                                                          ).widget_items[
                                                            widgetItemIndex
                                                          ] as any
                                                        ).title
                                                      : undefined
                                                  }
                                                  autoFocus
                                                  placeholder="Enter Widget Title"
                                                  isCustomRequired
                                                  customErrorMap=""
                                                />
                                              </div>

                                              <div className="row mt-2">
                                                {/* Column 1 */}
                                                <div className="col-lg-4">
                                                  <Field
                                                    name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.isTimeSeries`}
                                                  >
                                                    {({
                                                      field,
                                                    }: FieldProps<string>) => (
                                                      <CustomInputField
                                                        validationSchema={
                                                          validationSchema
                                                        }
                                                        label="Time Series"
                                                        error={
                                                          errors.indicator as string
                                                        }
                                                        field={field}
                                                      >
                                                        <Field
                                                          name={field.name}
                                                          component={
                                                            CustomSelect
                                                          }
                                                          id={field.name}
                                                          onChange={(
                                                            e: any,
                                                          ) => {
                                                            setFieldValue(
                                                              field.name,
                                                              e?.value === true,
                                                            );
                                                          }}
                                                          value={
                                                            values
                                                              .widget_blocks?.[
                                                              blockIndex
                                                            ]?.widget_columns?.[
                                                              widgetIndex
                                                            ]?.isTimeSeries
                                                              ? {
                                                                  label: 'Yes',
                                                                  value: true,
                                                                }
                                                              : {
                                                                  label: 'No',
                                                                  value: false,
                                                                }
                                                          }
                                                          options={[
                                                            {
                                                              label: 'Yes',
                                                              value: true,
                                                            },
                                                            {
                                                              label: 'No',
                                                              value: false,
                                                            },
                                                          ]}
                                                        />
                                                      </CustomInputField>
                                                    )}
                                                  </Field>
                                                </div>

                                                {/* Column 2 */}
                                                <div className="col-lg-4">
                                                  <Field
                                                    name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.isLastData`}
                                                  >
                                                    {({
                                                      field,
                                                    }: FieldProps<string>) => (
                                                      <CustomInputField
                                                        validationSchema={
                                                          validationSchema
                                                        }
                                                        label="Last Data"
                                                        error={
                                                          errors.indicator as string
                                                        }
                                                        field={field}
                                                      >
                                                        <Field
                                                          name={field.name}
                                                          component={
                                                            CustomSelect
                                                          }
                                                          id={field.name}
                                                          onChange={(
                                                            e: any,
                                                          ) => {
                                                            setFieldValue(
                                                              field.name,
                                                              e?.value === true,
                                                            );
                                                          }}
                                                          value={
                                                            values
                                                              .widget_blocks?.[
                                                              blockIndex
                                                            ]?.widget_columns?.[
                                                              widgetIndex
                                                            ]?.isLastData
                                                              ? {
                                                                  label: 'Yes',
                                                                  value: true,
                                                                }
                                                              : {
                                                                  label: 'No',
                                                                  value: false,
                                                                }
                                                          }
                                                          options={[
                                                            {
                                                              label: 'Yes',
                                                              value: true,
                                                            },
                                                            {
                                                              label: 'No',
                                                              value: false,
                                                            },
                                                          ]}
                                                        />
                                                      </CustomInputField>
                                                    )}
                                                  </Field>
                                                </div>

                                                {/* Column 3 */}
                                                <div className="col-lg-4">
                                                  <Field
                                                    name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.filter`}
                                                  >
                                                    {({
                                                      field,
                                                    }: FieldProps<boolean>) => (
                                                      <CustomInputField
                                                        validationSchema={
                                                          validationSchema
                                                        }
                                                        label="Data Filter"
                                                        error={
                                                          errors.indicator as string
                                                        }
                                                        field={field}
                                                      >
                                                        <Field
                                                          name={field.name}
                                                          component={
                                                            CustomSelect
                                                          }
                                                          id={field.name}
                                                          onChange={(
                                                            e: any,
                                                          ) => {
                                                            setFieldValue(
                                                              field.name,
                                                              e?.value,
                                                            );
                                                          }}
                                                          value={
                                                            values
                                                              .widget_blocks?.[
                                                              blockIndex
                                                            ]?.widget_columns?.[
                                                              widgetIndex
                                                            ]?.widget_items?.[
                                                              widgetItemIndex
                                                            ]?.filter === true
                                                              ? {
                                                                  label: 'Yes',
                                                                  value: true,
                                                                }
                                                              : {
                                                                  label: 'No',
                                                                  value: false,
                                                                }
                                                          }
                                                          options={[
                                                            {
                                                              label: 'Yes',
                                                              value: true,
                                                            },
                                                            {
                                                              label: 'No',
                                                              value: false,
                                                            },
                                                          ]}
                                                        />
                                                      </CustomInputField>
                                                    )}
                                                  </Field>
                                                </div>

                                                {/* Column 4 */}
                                                {values?.widget_blocks?.[
                                                  blockIndex
                                                ]?.widget_columns?.[widgetIndex]
                                                  ?.widget_items?.[
                                                  widgetItemIndex
                                                ]?.filter === true && (
                                                  <FieldArray
                                                    name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.filters`}
                                                  >
                                                    {({
                                                      push: addFilter,
                                                      remove: removeFilter,
                                                    }) => {
                                                      // Get filters array
                                                      const filters: any[] =
                                                        values.widget_blocks[
                                                          blockIndex
                                                        ].widget_columns[
                                                          widgetIndex
                                                        ].widget_items[
                                                          widgetItemIndex
                                                        ].filters || [];

                                                      // If empty, create a default filter block so map always has something
                                                      const renderFilters =
                                                        filters.length > 0
                                                          ? filters
                                                          : [
                                                              {
                                                                public_question_id:
                                                                  '',
                                                                universal_question_id:
                                                                  '',
                                                                is_option: false,
                                                              },
                                                            ];

                                                      return (
                                                        <div>
                                                          {/* Map existing or default filters */}
                                                          {renderFilters.map(
                                                            (
                                                              filter: any,
                                                              filterIndex: number,
                                                            ) => (
                                                              <div
                                                                // eslint-disable-next-line react/no-array-index-key
                                                                key={
                                                                  // eslint-disable-next-line react/no-array-index-key
                                                                  filterIndex
                                                                }
                                                                className="p-3 mb-3 border rounded mt-3"
                                                              >
                                                                <h6 className="text-capitalize pb-2 fw-bold">
                                                                  Filter Block
                                                                  {' '}
                                                                  {filterIndex +
                                                                    1}
                                                                </h6>

                                                                <Field
                                                                  name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.filters.${filterIndex}`}
                                                                >
                                                                  {({
                                                                    field,
                                                                  }: any) => {
                                                                    const options: any[] =
                                                                      selectedDepartmentData?.questions?.map(
                                                                        (
                                                                          q: any,
                                                                        ) => ({
                                                                          value: `${q.id} - ${q.universal_question_id}`,
                                                                          label: `${q.title} [${q.universal_question_id}]`,
                                                                        }),
                                                                      ) || [];

                                                                    const selectedValue: any =
                                                                      field
                                                                        .value
                                                                        ?.public_question_id &&
                                                                      field
                                                                        .value
                                                                        ?.universal_question_id
                                                                        ? options.find(
                                                                            (
                                                                              o,
                                                                            ) =>
                                                                              o.value ===
                                                                              `${field.value.public_question_id} - ${field.value.universal_question_id}`,
                                                                          ) || {
                                                                            value:
                                                                              '',
                                                                            label:
                                                                              '',
                                                                          }
                                                                        : {
                                                                            value:
                                                                              '',
                                                                            label:
                                                                              '',
                                                                          };

                                                                    return (
                                                                      <CustomInputField
                                                                        validationSchema={
                                                                          validationSchema
                                                                        }
                                                                        label="Question"
                                                                        error={
                                                                          errors.indicator as string
                                                                        }
                                                                        field={
                                                                          field
                                                                        }
                                                                        isCustomRequired
                                                                      >
                                                                        <Field
                                                                          name={
                                                                            field.name
                                                                          }
                                                                          component={
                                                                            CustomSelect
                                                                          }
                                                                          id={
                                                                            field.name
                                                                          }
                                                                          value={
                                                                            selectedValue
                                                                          }
                                                                          options={
                                                                            options
                                                                          }
                                                                          onChange={(
                                                                            e: any,
                                                                          ) => {
                                                                            if (
                                                                              !e
                                                                            ) {
                                                                              setFieldValue(
                                                                                field.name,
                                                                                null,
                                                                              );
                                                                              return;
                                                                            }

                                                                            const [
                                                                              public_question_id,
                                                                              universal_question_id,
                                                                            ] =
                                                                              e.value.split(
                                                                                ' - ',
                                                                              );

                                                                            const selectedQuestion =
                                                                              selectedDepartmentData?.questions?.find(
                                                                                (
                                                                                  q: any,
                                                                                ) =>
                                                                                  q.id ===
                                                                                    public_question_id &&
                                                                                  q.universal_question_id ===
                                                                                    universal_question_id,
                                                                              );

                                                                            setFieldValue(
                                                                              field.name,
                                                                              {
                                                                                public_question_id,
                                                                                universal_question_id,
                                                                                is_option:
                                                                                  selectedQuestion?.question_type ===
                                                                                  'SINGLE_SELECT',
                                                                              },
                                                                            );
                                                                          }}
                                                                        />
                                                                      </CustomInputField>
                                                                    );
                                                                  }}
                                                                </Field>
                                                              </div>
                                                            ),
                                                          )}

                                                          {/* Add/Delete Buttons */}
                                                          <div className="d-flex justify-content-end gap-3 align-items-center adding-deleting-sites">
                                                            {filters.length >
                                                              0 && (
                                                              <Button
                                                                className="my-4 py-2 btn-sm px-sm-4 savebtn mt-0"
                                                                onClick={() =>
                                                                  removeFilter(
                                                                    filters.length -
                                                                      1,
                                                                  )}
                                                              >
                                                                Delete Filter
                                                              </Button>
                                                            )}

                                                            <Button
                                                              className="my-4 py-2 btn-sm px-sm-4 savebtn mt-0"
                                                              onClick={() =>
                                                                addFilter({
                                                                  public_question_id:
                                                                    '',
                                                                  universal_question_id:
                                                                    '',
                                                                  is_option: false,
                                                                })}
                                                            >
                                                              Add Filter
                                                            </Button>
                                                          </div>
                                                        </div>
                                                      );
                                                    }}
                                                  </FieldArray>
                                                )}
                                              </div>

                                              {widgetItem?.combined_parameters?.map(
                                                (
                                                  combinedParam: any,
                                                  combinedParamIndex: any,
                                                ) => (
                                                  // eslint-disable-next-line react/no-array-index-key
                                                  <div key={combinedParamIndex}>
                                                    <div className=" text-capitalize pb-2 fw-bold mt-3">
                                                      Combined Parameter
                                                    </div>
                                                    <div
                                                      // eslint-disable-next-line react/no-array-index-key
                                                      key={combinedParamIndex}
                                                      className=" p-3 border rounded-1 bg-light mb-5 position-relative animated-element"
                                                    >
                                                      <FieldArray
                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters`}
                                                      >
                                                        {({
                                                          push: addCustomParameter,
                                                          remove:
                                                            removeCustomParameter,
                                                        }) =>
                                                          combinedParam?.custom_parameters?.map(
                                                            (
                                                              customParameter: any,
                                                              customParameterIndex: any,
                                                            ) => (
                                                              // eslint-disable-next-line react/jsx-key
                                                              <div className=" border p-3 mb-3 rounded-1 site-bg animated-element">
                                                                <div className=" text-capitalize pb-2 fw-bold">{`Custom Parameter ${customParameterIndex + 1}`}</div>
                                                                {values
                                                                  .widget_blocks?.[
                                                                  blockIndex
                                                                ]
                                                                  ?.widget_columns?.[
                                                                  widgetIndex
                                                                ]
                                                                  ?.widget_type ===
                                                                  'chart' && (
                                                                  <div className="row  position-relative">
                                                                    {![
                                                                      'pie',
                                                                      'donut',
                                                                      'radialBar',
                                                                    ].includes(
                                                                      values
                                                                        .widget_blocks?.[
                                                                        blockIndex
                                                                      ]
                                                                        ?.widget_columns?.[
                                                                        widgetIndex
                                                                      ]
                                                                        ?.chart_type,
                                                                    ) && (
                                                                      <div className="col-lg-12">
                                                                        <FormikField
                                                                          name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.label`}
                                                                          type="text"
                                                                          validationSchema={
                                                                            validationSchema
                                                                          }
                                                                          label="Chart Label"
                                                                          // errors={errors}
                                                                          autoFocus
                                                                          placeholder="Enter Label Name"
                                                                        />
                                                                      </div>
                                                                    )}

                                                                    <div className="col-lg-12 mt-2">
                                                                      <FormikField
                                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.legends`}
                                                                        type="text"
                                                                        validationSchema={
                                                                          validationSchema
                                                                        }
                                                                        label="Chart Legend"
                                                                        // errors={errors}
                                                                        autoFocus
                                                                        placeholder="Enter Legend Name"
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                )}
                                                                {![
                                                                  'textArea',
                                                                  'table',
                                                                ].includes(
                                                                  values
                                                                    .widget_blocks?.[
                                                                    blockIndex
                                                                  ]
                                                                    ?.widget_columns?.[
                                                                    widgetIndex
                                                                  ]?.widget_type,
                                                                ) && (
                                                                  <div className="row mt-2">
                                                                    <div className="col-lg-12">
                                                                      <FormikField
                                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.unit`}
                                                                        type="text"
                                                                        validationSchema={
                                                                          validationSchema
                                                                        }
                                                                        label="Unit"
                                                                        // errors={errors}
                                                                        autoFocus
                                                                        placeholder="Enter Unit"
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                )}
                                                                {/* Nested FieldArray for formulas inside this custom parameter */}
                                                                <FieldArray
                                                                  name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`}
                                                                >
                                                                  {({
                                                                    push: addFormula,
                                                                    remove:
                                                                      removeFormula,
                                                                  }) => (
                                                                    <div>
                                                                      {customParameter?.formulas?.map(
                                                                        (
                                                                          formula: any,
                                                                          formulaIndex: any,
                                                                        ) => {
                                                                          // Get selected module, indicator, subindicator for this formula row
                                                                          const selectedDepartmentId =
                                                                            values
                                                                              ?.widget_blocks?.[
                                                                              blockIndex
                                                                            ]
                                                                              ?.widget_columns?.[
                                                                              widgetIndex
                                                                            ]
                                                                              ?.widget_items?.[
                                                                              widgetItemIndex
                                                                            ]
                                                                              ?.combined_parameters?.[
                                                                              combinedParamIndex
                                                                            ]
                                                                              ?.custom_parameters?.[
                                                                              customParameterIndex
                                                                            ]
                                                                              ?.formulas?.[
                                                                              formulaIndex
                                                                            ]
                                                                              ?.department;

                                                                          const departmentObj =
                                                                            departmentsData?.find(
                                                                              (
                                                                                m: any,
                                                                              ) =>
                                                                                m.id ===
                                                                                selectedDepartmentId,
                                                                            );
                                                                          const widgetType =
                                                                            values
                                                                              .widget_blocks?.[
                                                                              blockIndex
                                                                            ]
                                                                              ?.widget_columns?.[
                                                                              widgetIndex
                                                                            ]
                                                                              ?.widget_type;
                                                                          const questionOptions =
                                                                            departmentObj?.questions
                                                                              ?.filter(
                                                                                (
                                                                                  q: any,
                                                                                  idx: number,
                                                                                  arr: any[],
                                                                                ) => {
                                                                                  // Remove duplicates
                                                                                  if (
                                                                                    arr.findIndex(
                                                                                      (
                                                                                        qq: any,
                                                                                      ) =>
                                                                                        qq.id ===
                                                                                        q.id,
                                                                                    ) !==
                                                                                    idx
                                                                                  ) {
                                                                                    return false;
                                                                                  }
                                                                                  // Filter by widget_type and question_type
                                                                                  if (
                                                                                    widgetType ===
                                                                                    'textArea'
                                                                                  ) {
                                                                                    return (
                                                                                      q.question_type ===
                                                                                      'TEXT'
                                                                                    );
                                                                                  }
                                                                                  // For 'card' or 'chart', show only number questions
                                                                                  if (
                                                                                    widgetType ===
                                                                                      'card' ||
                                                                                    widgetType ===
                                                                                      'chart'
                                                                                  ) {
                                                                                    return (
                                                                                      q.question_type ===
                                                                                        'NUMBER' ||
                                                                                      q.question_type ===
                                                                                        'MIXED_TYPE'
                                                                                    );
                                                                                  }
                                                                                  if (
                                                                                    widgetType ===
                                                                                    'table'
                                                                                  ) {
                                                                                    return (
                                                                                      q.question_type ===
                                                                                      'GROUP'
                                                                                    );
                                                                                  }
                                                                                  // Default: show all
                                                                                  return true;
                                                                                },
                                                                              )
                                                                              ?.sort(
                                                                                (
                                                                                  a: any,
                                                                                  b: any,
                                                                                ) =>
                                                                                  Number(
                                                                                    a.universal_question_id.replace(
                                                                                      'UID_',
                                                                                      '',
                                                                                    ),
                                                                                  ) -
                                                                                  Number(
                                                                                    b.universal_question_id.replace(
                                                                                      'UID_',
                                                                                      '',
                                                                                    ),
                                                                                  ),
                                                                              ) ||
                                                                            [];

                                                                          const selectedModuleId =
                                                                            values
                                                                              .widget_blocks?.[
                                                                              blockIndex
                                                                            ]
                                                                              ?.widget_columns?.[
                                                                              widgetIndex
                                                                            ]
                                                                              ?.widget_items?.[
                                                                              widgetItemIndex
                                                                            ]
                                                                              ?.combined_parameters?.[
                                                                              combinedParamIndex
                                                                            ]
                                                                              ?.custom_parameters?.[
                                                                              customParameterIndex
                                                                            ]
                                                                              ?.formulas?.[
                                                                              formulaIndex
                                                                            ]
                                                                              ?.module;

                                                                          const selectedIndicatorId =
                                                                            values
                                                                              .widget_blocks?.[
                                                                              blockIndex
                                                                            ]
                                                                              ?.widget_columns?.[
                                                                              widgetIndex
                                                                            ]
                                                                              ?.widget_items?.[
                                                                              widgetItemIndex
                                                                            ]
                                                                              ?.combined_parameters?.[
                                                                              combinedParamIndex
                                                                            ]
                                                                              ?.custom_parameters?.[
                                                                              customParameterIndex
                                                                            ]
                                                                              ?.formulas?.[
                                                                              formulaIndex
                                                                            ]
                                                                              ?.indicator;

                                                                          const selectedSubIndicatorId =
                                                                            values
                                                                              .widget_blocks?.[
                                                                              blockIndex
                                                                            ]
                                                                              ?.widget_columns?.[
                                                                              widgetIndex
                                                                            ]
                                                                              ?.widget_items?.[
                                                                              widgetItemIndex
                                                                            ]
                                                                              ?.combined_parameters?.[
                                                                              combinedParamIndex
                                                                            ]
                                                                              ?.custom_parameters?.[
                                                                              customParameterIndex
                                                                            ]
                                                                              ?.formulas?.[
                                                                              formulaIndex
                                                                            ]
                                                                              ?.subindicator;

                                                                          const moduleObj =
                                                                            modules?.find(
                                                                              (
                                                                                m: any,
                                                                              ) =>
                                                                                m.id ===
                                                                                selectedModuleId,
                                                                            );
                                                                          // console.log(
                                                                          //   moduleObj?.indicators,
                                                                          //   'moduleObj?.indicators'
                                                                          // );
                                                                          const indicatorObj =
                                                                            moduleObj?.indicators?.find(
                                                                              (
                                                                                i: any,
                                                                              ) =>
                                                                                i.id ===
                                                                                selectedIndicatorId,
                                                                            );
                                                                          // console.log(indicatorObj, 'indicatorObj')

                                                                          const allQuestions =
                                                                            indicatorObj?.standard_questions ||
                                                                            [];
                                                                          // console.log(
                                                                          //   allQuestions,
                                                                          //   'allQuestions'
                                                                          // );
                                                                          const sequenceQuestion =
                                                                            indicatorObj?.question_sequence ||
                                                                            [];
                                                                          // console.log(
                                                                          //   sequenceQuestion,
                                                                          //   'sequenceQuestions'
                                                                          // );
                                                                          const sequenceOptions =
                                                                            sequenceQuestion
                                                                              .filter(
                                                                                (
                                                                                  item: any,
                                                                                ) =>
                                                                                  item.questable_type ===
                                                                                  'GROUP',
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  q: any,
                                                                                ) => ({
                                                                                  label:
                                                                                    q
                                                                                      .group_questions
                                                                                      .name,
                                                                                  value:
                                                                                    q
                                                                                      .group_questions
                                                                                      .id,
                                                                                }),
                                                                              );

                                                                          // console.log(
                                                                          //   sequenceOptions,
                                                                          //   'sequenceOptions'
                                                                          // );
                                                                          const tableGroupData =
                                                                            sequenceQuestion.filter(
                                                                              (
                                                                                item: any,
                                                                              ) =>
                                                                                item.questable_type ===
                                                                                'GROUP',
                                                                            );
                                                                          // console.log(
                                                                          //   getWidgetType(
                                                                          //     values
                                                                          //       .widget_blocks?.[
                                                                          //       blockIndex
                                                                          //     ]
                                                                          //       ?.widget_columns?.[
                                                                          //       widgetIndex
                                                                          //     ]
                                                                          //   ),
                                                                          //   'getWidgetValues'
                                                                          // );

                                                                          // console.log(
                                                                          //   tableGroupData,
                                                                          //   'tableData'
                                                                          // );
                                                                          // console.log("All Questions:", allQuestions);

                                                                          const grouped =
                                                                            groupQuestionsBySubindicator(
                                                                              allQuestions,
                                                                            );

                                                                          const subindicatorOptions =
                                                                            Object.values(
                                                                              grouped,
                                                                            )
                                                                              .filter(
                                                                                (
                                                                                  g,
                                                                                ) =>
                                                                                  g.subindicator,
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  g,
                                                                                ) => ({
                                                                                  // label:
                                                                                  //   g
                                                                                  //     .subindicator
                                                                                  //     ?.name,
                                                                                  // value:
                                                                                  //   g
                                                                                  //     .subindicator
                                                                                  //     ?.id,
                                                                                  label:
                                                                                    g
                                                                                      .subindicator
                                                                                      ?.name
                                                                                      ? g
                                                                                          .subindicator
                                                                                          ?.name
                                                                                      : 'No Indicator',
                                                                                  value:
                                                                                    g
                                                                                      .subindicator
                                                                                      ?.id,
                                                                                }),
                                                                              );

                                                                          const standardQuestionOptions =
                                                                            grouped[
                                                                              selectedSubIndicatorId
                                                                            ]?.questions
                                                                              ?.filter(
                                                                                (
                                                                                  q: any,
                                                                                  idx: number,
                                                                                  arr: any[],
                                                                                ) => {
                                                                                  // Remove duplicates
                                                                                  if (
                                                                                    arr.findIndex(
                                                                                      (
                                                                                        qq: any,
                                                                                      ) =>
                                                                                        qq.id ===
                                                                                        q.id,
                                                                                    ) !==
                                                                                    idx
                                                                                  ) {
                                                                                    return false;
                                                                                  }
                                                                                  // Filter by widget_type and question_type
                                                                                  if (
                                                                                    widgetType ===
                                                                                    'textArea'
                                                                                  ) {
                                                                                    return (
                                                                                      q.question_type ===
                                                                                      'TEXT'
                                                                                    );
                                                                                  }
                                                                                  // For 'card' or 'chart', show only number questions
                                                                                  if (
                                                                                    widgetType ===
                                                                                      'card' ||
                                                                                    widgetType ===
                                                                                      'chart'
                                                                                  ) {
                                                                                    return (
                                                                                      q.question_type ===
                                                                                        'NUMBER' ||
                                                                                      q.question_type ===
                                                                                        'MIXED_TYPE'
                                                                                    );
                                                                                  }

                                                                                  return true;
                                                                                },
                                                                              )
                                                                              .filter(
                                                                                (
                                                                                  q,
                                                                                  index,
                                                                                  self,
                                                                                ) =>
                                                                                  index ===
                                                                                  self.findIndex(
                                                                                    (
                                                                                      t,
                                                                                    ) =>
                                                                                      t.universal_question_id ===
                                                                                      q.universal_question_id,
                                                                                  ),
                                                                              )
                                                                              .sort(
                                                                                (
                                                                                  a,
                                                                                  b,
                                                                                ) =>
                                                                                  Number(
                                                                                    a.universal_question_id.replace(
                                                                                      'UID_',
                                                                                      '',
                                                                                    ),
                                                                                  ) -
                                                                                  Number(
                                                                                    b.universal_question_id.replace(
                                                                                      'UID_',
                                                                                      '',
                                                                                    ),
                                                                                  ),
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  question: any,
                                                                                ) => ({
                                                                                  label: `${question?.title} [${question?.universal_question_id}]`,
                                                                                  value:
                                                                                    question?.universal_question_id,
                                                                                }),
                                                                              ) ||
                                                                            [];
                                                                          return (
                                                                            <div
                                                                              className=" border p-3 rounded-1 site-bg animated-element mt-3"
                                                                              key={
                                                                                // eslint-disable-next-line react/no-array-index-key
                                                                                formulaIndex
                                                                              }
                                                                            >
                                                                              <div className=" text-capitalize pb-2 fw-bold">{`Macro Parameter ${formulaIndex + 1}`}</div>
                                                                              {values.dashboard ===
                                                                                'standard' && (
                                                                                <div>
                                                                                  <Row>
                                                                                    <Col className="">
                                                                                      <Field
                                                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.module`}
                                                                                      >
                                                                                        {({
                                                                                          field,
                                                                                        }: FieldProps<string>) => (
                                                                                          <CustomInputField
                                                                                            validationSchema={
                                                                                              validationSchema
                                                                                            }
                                                                                            label="Module"
                                                                                            error={
                                                                                              errors.indicator as string
                                                                                            }
                                                                                            field={
                                                                                              field
                                                                                            }
                                                                                            isCustomRequired
                                                                                          >
                                                                                            <Field
                                                                                              name={
                                                                                                field.name
                                                                                              }
                                                                                              component={
                                                                                                CustomSelect
                                                                                              }
                                                                                              id={
                                                                                                field.name
                                                                                              }
                                                                                              onFieldUpdate={(
                                                                                                e: any,
                                                                                              ) => {
                                                                                                const selectedModuleId =
                                                                                                  e?.value;
                                                                                                setSelectedMacroModule(
                                                                                                  e?.value,
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  field.name,
                                                                                                  e?.value,
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.indicator`,
                                                                                                  '',
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.subindicator`,
                                                                                                  '',
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.questions`,
                                                                                                  '',
                                                                                                );

                                                                                                const questionModule =
                                                                                                  modules.find(
                                                                                                    (
                                                                                                      module: any,
                                                                                                    ) =>
                                                                                                      module.id ===
                                                                                                      selectedModuleId,
                                                                                                  );
                                                                                                setMacroIndicators(
                                                                                                  questionModule?.indicators ||
                                                                                                    [],
                                                                                                );
                                                                                                setMacroSubIndicators(
                                                                                                  [],
                                                                                                );
                                                                                                setMacroQuestions(
                                                                                                  [],
                                                                                                );
                                                                                              }}
                                                                                              // onChange={(e: any) => {
                                                                                              //   setFieldValue(field.name, e?.value);
                                                                                              // }}
                                                                                              value={
                                                                                                values
                                                                                                  ?.widget_blocks?.[
                                                                                                  blockIndex
                                                                                                ]
                                                                                                  ?.widget_columns?.[
                                                                                                  widgetIndex
                                                                                                ]
                                                                                                  ?.widget_items?.[
                                                                                                  widgetItemIndex
                                                                                                ]
                                                                                                  ?.combined_parameters?.[
                                                                                                  combinedParamIndex
                                                                                                ]
                                                                                                  ?.custom_parameters?.[
                                                                                                  customParameterIndex
                                                                                                ]
                                                                                                  ?.formulas?.[
                                                                                                  formulaIndex
                                                                                                ]
                                                                                                  ?.module
                                                                                              }
                                                                                              options={modules?.map(
                                                                                                (
                                                                                                  module: any,
                                                                                                ) => ({
                                                                                                  label:
                                                                                                    module.name,
                                                                                                  value:
                                                                                                    module.id,
                                                                                                }),
                                                                                              )}
                                                                                            />
                                                                                          </CustomInputField>
                                                                                        )}
                                                                                      </Field>
                                                                                    </Col>
                                                                                  </Row>
                                                                                  <Row>
                                                                                    <Col className="mt-2">
                                                                                      <Field
                                                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.indicator`}
                                                                                      >
                                                                                        {({
                                                                                          field,
                                                                                        }: FieldProps<string>) => (
                                                                                          // <CustomInputField
                                                                                          <CustomInputField
                                                                                            validationSchema={
                                                                                              validationSchema
                                                                                            }
                                                                                            label="Indicator"
                                                                                            error={
                                                                                              errors.indicator as string
                                                                                            }
                                                                                            field={
                                                                                              field
                                                                                            }
                                                                                            isCustomRequired
                                                                                          >
                                                                                            <Field
                                                                                              name={
                                                                                                field.name
                                                                                              }
                                                                                              component={
                                                                                                CustomSelect
                                                                                              }
                                                                                              id={
                                                                                                field.name
                                                                                              }
                                                                                              onFieldUpdate={(
                                                                                                e: any,
                                                                                              ) => {
                                                                                                const selectedIndicatorId =
                                                                                                  e?.value;
                                                                                                setFieldValue(
                                                                                                  field.name,
                                                                                                  e?.value,
                                                                                                );
                                                                                                // setFieldValue('indicator', '');
                                                                                                setFieldValue(
                                                                                                  `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.subindicator`,
                                                                                                  '',
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.questions`,
                                                                                                  '',
                                                                                                );

                                                                                                const questionIndicator: any =
                                                                                                  macroIndicators.find(
                                                                                                    (
                                                                                                      indicator: any,
                                                                                                    ) =>
                                                                                                      indicator.id ===
                                                                                                      selectedIndicatorId,
                                                                                                  );
                                                                                                // setIndicators(module?.indicators || []);

                                                                                                //                                                                                       const selectedIndicator = indicators.find(
                                                                                                //   (ind: any) => ind.id === values.indicator
                                                                                                // );
                                                                                                const allQuestions =
                                                                                                  questionIndicator?.standard_question ||
                                                                                                  [];
                                                                                                const grouped =
                                                                                                  groupQuestionsBySubindicator(
                                                                                                    allQuestions,
                                                                                                  );
                                                                                                const subindicatorOptions: any =
                                                                                                  Object.values(
                                                                                                    grouped,
                                                                                                  )
                                                                                                    .filter(
                                                                                                      (
                                                                                                        g,
                                                                                                      ) =>
                                                                                                        g.subindicator,
                                                                                                    ) // skip "NO_SUBINDICATOR" if you want
                                                                                                    .map(
                                                                                                      (
                                                                                                        g,
                                                                                                      ) => ({
                                                                                                        label:
                                                                                                          g
                                                                                                            .subindicator
                                                                                                            ?.name,
                                                                                                        value:
                                                                                                          g
                                                                                                            .subindicator
                                                                                                            ?.id,
                                                                                                      }),
                                                                                                    );
                                                                                                setMacroSubIndicators(
                                                                                                  subindicatorOptions,
                                                                                                );
                                                                                                setGroupedQuestions(
                                                                                                  grouped,
                                                                                                );
                                                                                                setMacroQuestions(
                                                                                                  // questionIndicator?.standard_question
                                                                                                  // grouped
                                                                                                  [],
                                                                                                );
                                                                                              }}
                                                                                              // onChange={(e: any) => {
                                                                                              //   setFieldValue(field.name, e?.value);
                                                                                              // }}
                                                                                              value={
                                                                                                moduleObj?.indicators
                                                                                                  ?.map(
                                                                                                    (
                                                                                                      i: any,
                                                                                                    ) => ({
                                                                                                      label:
                                                                                                        i.name,
                                                                                                      value:
                                                                                                        i.id,
                                                                                                    }),
                                                                                                  )
                                                                                                  ?.find(
                                                                                                    (
                                                                                                      opt: any,
                                                                                                    ) =>
                                                                                                      opt.value ===
                                                                                                      selectedIndicatorId,
                                                                                                  ) ||
                                                                                                null
                                                                                              }
                                                                                              options={moduleObj?.indicators?.map(
                                                                                                (
                                                                                                  i: any,
                                                                                                ) => ({
                                                                                                  label:
                                                                                                    i.name,
                                                                                                  value:
                                                                                                    i.id,
                                                                                                }),
                                                                                              )}
                                                                                            />
                                                                                          </CustomInputField>
                                                                                        )}
                                                                                      </Field>
                                                                                    </Col>
                                                                                  </Row>
                                                                                  <Row>
                                                                                    <Col className="mt-2">
                                                                                      {values
                                                                                        ?.widget_blocks?.[
                                                                                        blockIndex
                                                                                      ]
                                                                                        ?.widget_columns?.[
                                                                                        widgetIndex
                                                                                      ]
                                                                                        ?.widget_type !==
                                                                                        'table' && (
                                                                                        <Field
                                                                                          name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.subindicator`}
                                                                                        >
                                                                                          {({
                                                                                            field,
                                                                                          }: FieldProps<string>) => (
                                                                                            // <CustomInputField
                                                                                            <CustomInputField
                                                                                              validationSchema={
                                                                                                validationSchema
                                                                                              }
                                                                                              label="Sub Indicator"
                                                                                              error={
                                                                                                errors.indicator as string
                                                                                              }
                                                                                              field={
                                                                                                field
                                                                                              }
                                                                                              isCustomRequired
                                                                                            >
                                                                                              <Field
                                                                                                name={
                                                                                                  field.name
                                                                                                }
                                                                                                component={
                                                                                                  CustomSelect
                                                                                                }
                                                                                                id={
                                                                                                  field.name
                                                                                                }
                                                                                                onFieldUpdate={(
                                                                                                  e: any,
                                                                                                ) => {
                                                                                                  const selectedSubIndicatorId =
                                                                                                    e?.value;
                                                                                                  setFieldValue(
                                                                                                    field.name,
                                                                                                    e?.value,
                                                                                                  );
                                                                                                  // setFieldValue('indicator', '');
                                                                                                  setFieldValue(
                                                                                                    `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.questions`,
                                                                                                    '',
                                                                                                  );
                                                                                                  // const questionOptions =
                                                                                                  //   groupedQuestions[
                                                                                                  //     selectedSubIndicatorId
                                                                                                  //   ]?.questions?.map(
                                                                                                  //     (
                                                                                                  //       q: any
                                                                                                  //     ) => ({
                                                                                                  //       label:
                                                                                                  //         q.title,
                                                                                                  //       value:
                                                                                                  //         q.id,
                                                                                                  //     })
                                                                                                  //   ) ||
                                                                                                  //   [];
                                                                                                  // setMacroQuestions(
                                                                                                  //   questionOptions
                                                                                                  // );
                                                                                                }}
                                                                                                value={
                                                                                                  values
                                                                                                    ?.widget_blocks?.[
                                                                                                    blockIndex
                                                                                                  ]
                                                                                                    ?.widget_columns?.[
                                                                                                    widgetIndex
                                                                                                  ]
                                                                                                    ?.widget_items?.[
                                                                                                    widgetItemIndex
                                                                                                  ]
                                                                                                    ?.combined_parameters?.[
                                                                                                    combinedParamIndex
                                                                                                  ]
                                                                                                    ?.custom_parameters?.[
                                                                                                    customParameterIndex
                                                                                                  ]
                                                                                                    ?.formulas?.[
                                                                                                    formulaIndex
                                                                                                  ]
                                                                                                    ?.subindicator
                                                                                                }
                                                                                                options={
                                                                                                  // macroSubIndicators
                                                                                                  subindicatorOptions
                                                                                                }
                                                                                              />
                                                                                            </CustomInputField>
                                                                                          )}
                                                                                        </Field>
                                                                                      )}
                                                                                    </Col>
                                                                                  </Row>
                                                                                  <div
                                                                                    key={
                                                                                      // eslint-disable-next-line react/no-array-index-key
                                                                                      formulaIndex
                                                                                    }
                                                                                    className="row mt-2"
                                                                                  >
                                                                                    {/* Question Field */}
                                                                                    <div className="col-12 col-md-6">
                                                                                      <Field
                                                                                        name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.questions`}
                                                                                      >
                                                                                        {({
                                                                                          field,
                                                                                        }: FieldProps<
                                                                                          string[]
                                                                                        >) => (
                                                                                          <CustomInputField
                                                                                            validationSchema={
                                                                                              validationSchema
                                                                                            }
                                                                                            label={
                                                                                              values
                                                                                                ?.widget_blocks?.[
                                                                                                blockIndex
                                                                                              ]
                                                                                                ?.widget_columns?.[
                                                                                                widgetIndex
                                                                                              ]
                                                                                                ?.widget_type ===
                                                                                              'table'
                                                                                                ? 'Question Groups'
                                                                                                : 'Question'
                                                                                            }
                                                                                            error={
                                                                                              errors.indicator as string
                                                                                            }
                                                                                            field={
                                                                                              field
                                                                                            }
                                                                                            isCustomRequired
                                                                                          >
                                                                                            <Field
                                                                                              name={
                                                                                                field.name
                                                                                              }
                                                                                              component={
                                                                                                CustomSelect
                                                                                              }
                                                                                              id={
                                                                                                field.name
                                                                                              }
                                                                                              onChange={(
                                                                                                e: any,
                                                                                              ) => {
                                                                                                // 1) update this formula row's questions value
                                                                                                setFieldValue(
                                                                                                  field.name,
                                                                                                  e?.value,
                                                                                                );

                                                                                                setTableData(
                                                                                                  tableGroupData,
                                                                                                );

                                                                                                // 2) atomically update formulas array so Formik stays in sync
                                                                                                const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;
                                                                                                const currentFormulas =
                                                                                                  values
                                                                                                    ?.widget_blocks?.[
                                                                                                    blockIndex
                                                                                                  ]
                                                                                                    ?.widget_columns?.[
                                                                                                    widgetIndex
                                                                                                  ]
                                                                                                    ?.widget_items?.[
                                                                                                    widgetItemIndex
                                                                                                  ]
                                                                                                    ?.combined_parameters?.[
                                                                                                    combinedParamIndex
                                                                                                  ]
                                                                                                    ?.custom_parameters?.[
                                                                                                    customParameterIndex
                                                                                                  ]
                                                                                                    ?.formulas ||
                                                                                                  [];

                                                                                                const newFormulas =
                                                                                                  currentFormulas.map(
                                                                                                    (
                                                                                                      f: any,
                                                                                                      idx: number,
                                                                                                    ) =>
                                                                                                      (idx ===
                                                                                                      formulaIndex
                                                                                                        ? {
                                                                                                            ...f,
                                                                                                            questions:
                                                                                                              e?.value,
                                                                                                          }
                                                                                                        : f),
                                                                                                  );
                                                                                                setFieldValue(
                                                                                                  formulasPath,
                                                                                                  newFormulas,
                                                                                                  false,
                                                                                                );

                                                                                                // 3) recompute custom_formula display immediately
                                                                                                const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;
                                                                                                const display =
                                                                                                  newFormulas
                                                                                                    .map(
                                                                                                      (
                                                                                                        f: any,
                                                                                                      ) =>
                                                                                                        (Array.isArray(
                                                                                                          f?.questions,
                                                                                                        )
                                                                                                          ? f.questions.join(
                                                                                                              ' + ',
                                                                                                            )
                                                                                                          : f?.questions ||
                                                                                                            ''),
                                                                                                    )
                                                                                                    .filter(
                                                                                                      Boolean,
                                                                                                    )
                                                                                                    .join(
                                                                                                      ' + ',
                                                                                                    );
                                                                                                setFieldValue(
                                                                                                  customFormulaPath,
                                                                                                  display,
                                                                                                  false,
                                                                                                );

                                                                                                // 4) refresh derived options & force remount if you used cached option state
                                                                                                setGroupedQuestions(
                                                                                                  (
                                                                                                    prev: any,
                                                                                                  ) =>
                                                                                                    // recompute grouping for the current indicator if needed,
                                                                                                    // or clear to force recompute in effect that depends on values
                                                                                                    prev,
                                                                                                );
                                                                                                setFormulaVersion(
                                                                                                  (
                                                                                                    v,
                                                                                                  ) =>
                                                                                                    v +
                                                                                                    1,
                                                                                                );
                                                                                              }}
                                                                                              value={
                                                                                                values
                                                                                                  ?.widget_blocks?.[
                                                                                                  blockIndex
                                                                                                ]
                                                                                                  ?.widget_columns?.[
                                                                                                  widgetIndex
                                                                                                ]
                                                                                                  ?.widget_items?.[
                                                                                                  widgetItemIndex
                                                                                                ]
                                                                                                  ?.combined_parameters?.[
                                                                                                  combinedParamIndex
                                                                                                ]
                                                                                                  ?.custom_parameters?.[
                                                                                                  customParameterIndex
                                                                                                ]
                                                                                                  ?.formulas?.[
                                                                                                  formulaIndex
                                                                                                ]
                                                                                                  ?.questions
                                                                                              }
                                                                                              options={
                                                                                                widgetType ===
                                                                                                'table'
                                                                                                  ? sequenceOptions
                                                                                                  : standardQuestionOptions
                                                                                              }
                                                                                              key={`questions-${blockIndex}-${widgetIndex}-${widgetItemIndex}-${combinedParamIndex}-${customParameterIndex}-${formulaIndex}-${formulaVersion}`}
                                                                                            />
                                                                                          </CustomInputField>
                                                                                        )}
                                                                                      </Field>
                                                                                    </div>

                                                                                    {/* Delete Button */}
                                                                                    <div className="d-flex justify-content-end gap-3 align-items-center adding-deleting-sites mt-1">
                                                                                      <div>
                                                                                        <Button
                                                                                          className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                                          onClick={() => {
                                                                                            const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;
                                                                                            const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;

                                                                                            // current formulas from Formik values
                                                                                            const formulasArr =
                                                                                              values
                                                                                                ?.widget_blocks?.[
                                                                                                blockIndex
                                                                                              ]
                                                                                                ?.widget_columns?.[
                                                                                                widgetIndex
                                                                                              ]
                                                                                                ?.widget_items?.[
                                                                                                widgetItemIndex
                                                                                              ]
                                                                                                ?.combined_parameters?.[
                                                                                                combinedParamIndex
                                                                                              ]
                                                                                                ?.custom_parameters?.[
                                                                                                customParameterIndex
                                                                                              ]
                                                                                                ?.formulas ||
                                                                                              [];

                                                                                            // build new array excluding the removed formula
                                                                                            const newFormulas =
                                                                                              formulasArr.filter(
                                                                                                (
                                                                                                  _: any,
                                                                                                  idx: number,
                                                                                                ) =>
                                                                                                  idx !==
                                                                                                  formulaIndex,
                                                                                              );

                                                                                            // write new formulas into Formik (atomic replace avoids FieldArray timing issues)
                                                                                            setFieldValue(
                                                                                              formulasPath,
                                                                                              newFormulas,
                                                                                              false,
                                                                                            );

                                                                                            // rebuild and set displayed custom_formula immediately
                                                                                            const display =
                                                                                              Array.isArray(
                                                                                                newFormulas,
                                                                                              ) &&
                                                                                              newFormulas.length >
                                                                                                0
                                                                                                ? newFormulas
                                                                                                    .map(
                                                                                                      (
                                                                                                        f: any,
                                                                                                      ) =>
                                                                                                        (Array.isArray(
                                                                                                          f?.questions,
                                                                                                        )
                                                                                                          ? f.questions.join(
                                                                                                              ' + ',
                                                                                                            )
                                                                                                          : f?.questions ||
                                                                                                            ''),
                                                                                                    )
                                                                                                    .filter(
                                                                                                      Boolean,
                                                                                                    )
                                                                                                    .join(
                                                                                                      ' + ',
                                                                                                    )
                                                                                                : '';

                                                                                            setFieldValue(
                                                                                              customFormulaPath,
                                                                                              display,
                                                                                              false,
                                                                                            );

                                                                                            // --- recompute derived option state so selects update immediately ---

                                                                                            // pick a representative remaining formula (if any) to compute available questions
                                                                                            const representative =
                                                                                              newFormulas[0];

                                                                                            if (
                                                                                              representative &&
                                                                                              representative.module
                                                                                            ) {
                                                                                              const moduleObj =
                                                                                                modules.find(
                                                                                                  (
                                                                                                    m: any,
                                                                                                  ) =>
                                                                                                    m.id ===
                                                                                                    representative.module,
                                                                                                );
                                                                                              const indicatorObj =
                                                                                                moduleObj?.indicators?.find(
                                                                                                  (
                                                                                                    i: any,
                                                                                                  ) =>
                                                                                                    i.id ===
                                                                                                    representative.indicator,
                                                                                                );
                                                                                              const allQuestions =
                                                                                                indicatorObj?.standard_question ||
                                                                                                [];

                                                                                              // rebuild groupedQuestions for this indicator and set it
                                                                                              const grouped =
                                                                                                groupQuestionsBySubindicator(
                                                                                                  allQuestions,
                                                                                                );
                                                                                              setGroupedQuestions(
                                                                                                grouped,
                                                                                              );

                                                                                              // compute fresh macroQuestions options for current subindicator (or global flattened if none)
                                                                                              const subId =
                                                                                                representative.subindicator ||
                                                                                                Object.keys(
                                                                                                  grouped,
                                                                                                )[0];
                                                                                              const questionOptions =
                                                                                                (
                                                                                                  grouped[
                                                                                                    subId
                                                                                                  ]
                                                                                                    ?.questions ||
                                                                                                  []
                                                                                                ).map(
                                                                                                  (
                                                                                                    q: any,
                                                                                                  ) => ({
                                                                                                    label: `${q.title} [${q.universal_question_id}]`,
                                                                                                    value:
                                                                                                      q.id,
                                                                                                  }),
                                                                                                ) ||
                                                                                                [];

                                                                                              setMacroQuestions(
                                                                                                questionOptions,
                                                                                              );
                                                                                              setMacroIndicators(
                                                                                                moduleObj?.indicators ||
                                                                                                  [],
                                                                                              );
                                                                                              setMacroSubIndicators(
                                                                                                Object.values(
                                                                                                  grouped,
                                                                                                )
                                                                                                  .filter(
                                                                                                    (
                                                                                                      g: any,
                                                                                                    ) =>
                                                                                                      g.subindicator,
                                                                                                  )
                                                                                                  .map(
                                                                                                    (
                                                                                                      g: any,
                                                                                                    ) => ({
                                                                                                      label:
                                                                                                        g
                                                                                                          .subindicator
                                                                                                          ?.name ||
                                                                                                        'No Indicator',
                                                                                                      value:
                                                                                                        g
                                                                                                          .subindicator
                                                                                                          ?.id,
                                                                                                    }),
                                                                                                  ),
                                                                                              );
                                                                                            } else {
                                                                                              // no formulas left: clear derived states so selects refresh immediately
                                                                                              setGroupedQuestions(
                                                                                                {},
                                                                                              );
                                                                                              setMacroQuestions(
                                                                                                [],
                                                                                              );
                                                                                              setMacroIndicators(
                                                                                                [],
                                                                                              );
                                                                                              setMacroSubIndicators(
                                                                                                [],
                                                                                              );
                                                                                            }

                                                                                            // If you maintain any other derived state caches, recompute them here as well.
                                                                                          }}
                                                                                        >
                                                                                          Delete
                                                                                          Formula
                                                                                        </Button>
                                                                                      </div>
                                                                                      <div>
                                                                                        <Button
                                                                                          className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                                          onClick={() => {
                                                                                            const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;
                                                                                            const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;

                                                                                            const current =
                                                                                              values
                                                                                                ?.widget_blocks?.[
                                                                                                blockIndex
                                                                                              ]
                                                                                                ?.widget_columns?.[
                                                                                                widgetIndex
                                                                                              ]
                                                                                                ?.widget_items?.[
                                                                                                widgetItemIndex
                                                                                              ]
                                                                                                ?.combined_parameters?.[
                                                                                                combinedParamIndex
                                                                                              ]
                                                                                                ?.custom_parameters?.[
                                                                                                customParameterIndex
                                                                                              ]
                                                                                                ?.formulas ||
                                                                                              [];

                                                                                            const newFormulas =
                                                                                              [
                                                                                                ...current,
                                                                                                {
                                                                                                  module:
                                                                                                    '',
                                                                                                  indicator:
                                                                                                    '',
                                                                                                  subindicator:
                                                                                                    '',
                                                                                                  questions:
                                                                                                    '',
                                                                                                  // macro_function:
                                                                                                  //   '',
                                                                                                },
                                                                                              ];

                                                                                            // atomically replace Formik array
                                                                                            setFieldValue(
                                                                                              formulasPath,
                                                                                              newFormulas,
                                                                                              false,
                                                                                            );

                                                                                            // update custom_formula display immediately
                                                                                            const display =
                                                                                              newFormulas
                                                                                                .map(
                                                                                                  (
                                                                                                    f: any,
                                                                                                  ) =>
                                                                                                    (Array.isArray(
                                                                                                      f.questions,
                                                                                                    )
                                                                                                      ? f.questions.join(
                                                                                                          ' + ',
                                                                                                        )
                                                                                                      : f.questions ||
                                                                                                        ''),
                                                                                                )
                                                                                                .filter(
                                                                                                  Boolean,
                                                                                                )
                                                                                                .join(
                                                                                                  ' + ',
                                                                                                );
                                                                                            setFieldValue(
                                                                                              customFormulaPath,
                                                                                              display,
                                                                                              false,
                                                                                            );

                                                                                            // clear/recompute cached option arrays so selects rebuild
                                                                                            setGroupedQuestions(
                                                                                              {},
                                                                                            );
                                                                                            setMacroQuestions(
                                                                                              [],
                                                                                            );
                                                                                            setMacroIndicators(
                                                                                              [],
                                                                                            );
                                                                                            setMacroSubIndicators(
                                                                                              [],
                                                                                            );

                                                                                            // force remount of selects
                                                                                            setFormulaVersion(
                                                                                              (
                                                                                                v,
                                                                                              ) =>
                                                                                                v +
                                                                                                1,
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          Add
                                                                                          Formula
                                                                                        </Button>
                                                                                      </div>
                                                                                    </div>
                                                                                  </div>
                                                                                </div>
                                                                              )}

                                                                              {(values.dashboard ===
                                                                                '' ||
                                                                                values.dashboard ===
                                                                                  'department') && (
                                                                                  <div>
                                                                                    <Row>
                                                                                      <Col className="mt-3">
                                                                                        <Field
                                                                                          name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.department`}
                                                                                        >
                                                                                          {({
                                                                                          field,
                                                                                        }: FieldProps<string>) => (
                                                                                          <CustomInputField
                                                                                            validationSchema={
                                                                                              validationSchema
                                                                                            }
                                                                                            label="Department"
                                                                                            error={
                                                                                              errors.department as string
                                                                                            }
                                                                                            field={
                                                                                              field
                                                                                            }
                                                                                            isCustomRequired
                                                                                          >
                                                                                            <Field
                                                                                              name={
                                                                                                field.name
                                                                                              }
                                                                                              component={
                                                                                                CustomSelect
                                                                                              }
                                                                                              id={
                                                                                                field.name
                                                                                              }
                                                                                              onFieldUpdate={(
                                                                                                e: any,
                                                                                              ) => {
                                                                                                const selectedDepartmentId =
                                                                                                  e?.value;
                                                                                                setSelectedMacroDepartment(
                                                                                                  e?.value,
                                                                                                );
                                                                                                setFieldValue(
                                                                                                  field.name,
                                                                                                  e?.value,
                                                                                                );
                                                                                                const dashboardDepartment =
                                                                                                  departmentsData.find(
                                                                                                    (
                                                                                                      department: any,
                                                                                                    ) =>
                                                                                                      department.id ===
                                                                                                      selectedDepartmentId,
                                                                                                  );
                                                                                                setMacroQuestions(
                                                                                                  dashboardDepartment?.questions,
                                                                                                );
                                                                                              }}
                                                                                              // onChange={(e: any) => {
                                                                                              //   setFieldValue(field.name, e?.value);
                                                                                              // }}
                                                                                              value={
                                                                                                values
                                                                                                  ?.widget_blocks?.[
                                                                                                  blockIndex
                                                                                                ]
                                                                                                  ?.widget_columns?.[
                                                                                                  widgetIndex
                                                                                                ]
                                                                                                  ?.widget_items?.[
                                                                                                  widgetItemIndex
                                                                                                ]
                                                                                                  ?.combined_parameters?.[
                                                                                                  combinedParamIndex
                                                                                                ]
                                                                                                  ?.custom_parameters?.[
                                                                                                  customParameterIndex
                                                                                                ]
                                                                                                  ?.formulas?.[
                                                                                                  formulaIndex
                                                                                                ]
                                                                                                  ?.department
                                                                                              }
                                                                                              options={departmentsData?.map(
                                                                                                (
                                                                                                  department: any,
                                                                                                ) => ({
                                                                                                  label:
                                                                                                    department.name,
                                                                                                  value:
                                                                                                    department.id,
                                                                                                }),
                                                                                              )}
                                                                                            />
                                                                                          </CustomInputField>
                                                                                        )}
                                                                                        </Field>
                                                                                      </Col>
                                                                                    </Row>
                                                                                    <div
                                                                                      key={
                                                                                      // eslint-disable-next-line react/no-array-index-key
                                                                                      formulaIndex
                                                                                    }
                                                                                      className="row mt-2"
                                                                                    >
                                                                                      {/* Question Field */}
                                                                                      <div className="col-12 col-md-6">
                                                                                        <Field
                                                                                          name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas.${formulaIndex}.questions`}
                                                                                        >
                                                                                          {({
                                                                                          field,
                                                                                        }: FieldProps<string>) => (
                                                                                          <CustomInputField
                                                                                            validationSchema={
                                                                                              validationSchema
                                                                                            }
                                                                                            label="Question"
                                                                                            error={
                                                                                              errors.indicator as string
                                                                                            }
                                                                                            field={
                                                                                              field
                                                                                            }
                                                                                            isCustomRequired
                                                                                          >
                                                                                            <Field
                                                                                              name={
                                                                                                field.name
                                                                                              }
                                                                                              component={
                                                                                                CustomSelect
                                                                                              }
                                                                                              id={
                                                                                                field.name
                                                                                              }
                                                                                              // onChange={(
                                                                                              //   e: any
                                                                                              // ) => {
                                                                                              //   setFieldValue(
                                                                                              //     field.name,
                                                                                              //     e?.value
                                                                                              //   );
                                                                                              // }}

                                                                                              onChange={(
                                                                                                e: any,
                                                                                              ) => {
                                                                                                // 1) update this formula row's questions value
                                                                                                setFieldValue(
                                                                                                  field.name,
                                                                                                  e?.value,
                                                                                                );

                                                                                                // 2) atomically update formulas array so Formik stays in sync
                                                                                                const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;
                                                                                                const currentFormulas =
                                                                                                  values
                                                                                                    ?.widget_blocks?.[
                                                                                                    blockIndex
                                                                                                  ]
                                                                                                    ?.widget_columns?.[
                                                                                                    widgetIndex
                                                                                                  ]
                                                                                                    ?.widget_items?.[
                                                                                                    widgetItemIndex
                                                                                                  ]
                                                                                                    ?.combined_parameters?.[
                                                                                                    combinedParamIndex
                                                                                                  ]
                                                                                                    ?.custom_parameters?.[
                                                                                                    customParameterIndex
                                                                                                  ]
                                                                                                    ?.formulas ||
                                                                                                  [];

                                                                                                const newFormulas =
                                                                                                  currentFormulas.map(
                                                                                                    (
                                                                                                      f: any,
                                                                                                      idx: number,
                                                                                                    ) =>
                                                                                                      (idx ===
                                                                                                      formulaIndex
                                                                                                        ? {
                                                                                                            ...f,
                                                                                                            questions:
                                                                                                              e?.value,
                                                                                                          }
                                                                                                        : f),
                                                                                                  );
                                                                                                setFieldValue(
                                                                                                  formulasPath,
                                                                                                  newFormulas,
                                                                                                  false,
                                                                                                );

                                                                                                // 3) recompute custom_formula display immediately
                                                                                                const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;
                                                                                                const display =
                                                                                                  newFormulas
                                                                                                    .map(
                                                                                                      (
                                                                                                        f: any,
                                                                                                      ) =>
                                                                                                        (Array.isArray(
                                                                                                          f?.questions,
                                                                                                        )
                                                                                                          ? f.questions.join(
                                                                                                              ' + ',
                                                                                                            )
                                                                                                          : f?.questions ||
                                                                                                            ''),
                                                                                                    )
                                                                                                    .filter(
                                                                                                      Boolean,
                                                                                                    )
                                                                                                    .join(
                                                                                                      ' + ',
                                                                                                    );
                                                                                                setFieldValue(
                                                                                                  customFormulaPath,
                                                                                                  display,
                                                                                                  false,
                                                                                                );

                                                                                                // 4) refresh derived options & force remount if you used cached option state
                                                                                                // setGroupedQuestions(
                                                                                                //   (
                                                                                                //     prev: any
                                                                                                //   ) => {
                                                                                                //     // recompute grouping for the current indicator if needed,
                                                                                                //     // or clear to force recompute in effect that depends on values
                                                                                                //     return prev;
                                                                                                //   }
                                                                                                // );
                                                                                                setFormulaVersion(
                                                                                                  (
                                                                                                    v,
                                                                                                  ) =>
                                                                                                    v +
                                                                                                    1,
                                                                                                );
                                                                                              }}
                                                                                              value={
                                                                                                values
                                                                                                  .widget_blocks?.[
                                                                                                  blockIndex
                                                                                                ]
                                                                                                  ?.widget_columns?.[
                                                                                                  widgetIndex
                                                                                                ]
                                                                                                  ?.widget_items?.[
                                                                                                  widgetItemIndex
                                                                                                ]
                                                                                                  ?.combined_parameters?.[
                                                                                                  combinedParamIndex
                                                                                                ]
                                                                                                  ?.custom_parameters?.[
                                                                                                  customParameterIndex
                                                                                                ]
                                                                                                  .questions
                                                                                              }
                                                                                              // options={allQuestions?.map(
                                                                                              options={questionOptions?.map(
                                                                                                (
                                                                                                  question: any,
                                                                                                ) => ({
                                                                                                  label: `${question?.universal_question_id} - ${question?.title} [${question?.sub_indicator?.name}]`,
                                                                                                  value:
                                                                                                    question?.universal_question_id,
                                                                                                }),
                                                                                              )}
                                                                                            />
                                                                                          </CustomInputField>
                                                                                        )}
                                                                                        </Field>
                                                                                      </div>

                                                                                      {/* Delete Button */}
                                                                                      <div className="d-flex justify-content-end gap-3 align-items-center adding-deleting-sites mt-1">
                                                                                        <div>
                                                                                          <Button
                                                                                            className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                                          // onClick={() =>
                                                                                          //   removeFormula(
                                                                                          //     formulaIndex
                                                                                          //   )
                                                                                          // }
                                                                                            onClick={() => {
                                                                                            const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;
                                                                                            const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;

                                                                                            // current formulas from Formik values
                                                                                            const formulasArr =
                                                                                              values
                                                                                                ?.widget_blocks?.[
                                                                                                blockIndex
                                                                                              ]
                                                                                                ?.widget_columns?.[
                                                                                                widgetIndex
                                                                                              ]
                                                                                                ?.widget_items?.[
                                                                                                widgetItemIndex
                                                                                              ]
                                                                                                ?.combined_parameters?.[
                                                                                                combinedParamIndex
                                                                                              ]
                                                                                                ?.custom_parameters?.[
                                                                                                customParameterIndex
                                                                                              ]
                                                                                                ?.formulas ||
                                                                                              [];

                                                                                            // build new array excluding the removed formula
                                                                                            const newFormulas =
                                                                                              formulasArr.filter(
                                                                                                (
                                                                                                  _: any,
                                                                                                  idx: number,
                                                                                                ) =>
                                                                                                  idx !==
                                                                                                  formulaIndex,
                                                                                              );

                                                                                            // write new formulas into Formik (atomic replace avoids FieldArray timing issues)
                                                                                            setFieldValue(
                                                                                              formulasPath,
                                                                                              newFormulas,
                                                                                              false,
                                                                                            );

                                                                                            // rebuild and set displayed custom_formula immediately
                                                                                            const display =
                                                                                              Array.isArray(
                                                                                                newFormulas,
                                                                                              ) &&
                                                                                              newFormulas.length >
                                                                                                0
                                                                                                ? newFormulas
                                                                                                    .map(
                                                                                                      (
                                                                                                        f: any,
                                                                                                      ) =>
                                                                                                        (Array.isArray(
                                                                                                          f?.questions,
                                                                                                        )
                                                                                                          ? f.questions.join(
                                                                                                              ' + ',
                                                                                                            )
                                                                                                          : f?.questions ||
                                                                                                            ''),
                                                                                                    )
                                                                                                    .filter(
                                                                                                      Boolean,
                                                                                                    )
                                                                                                    .join(
                                                                                                      ' + ',
                                                                                                    )
                                                                                                : '';

                                                                                            setFieldValue(
                                                                                              customFormulaPath,
                                                                                              display,
                                                                                              false,
                                                                                            );

                                                                                            // --- recompute derived option state so selects update immediately ---

                                                                                            // pick a representative remaining formula (if any) to compute available questions
                                                                                            const representative =
                                                                                              newFormulas[0];

                                                                                            if (
                                                                                              representative &&
                                                                                              representative.module
                                                                                            ) {
                                                                                              const moduleObj =
                                                                                                modules.find(
                                                                                                  (
                                                                                                    m: any,
                                                                                                  ) =>
                                                                                                    m.id ===
                                                                                                    representative.module,
                                                                                                );
                                                                                              const indicatorObj =
                                                                                                moduleObj?.indicators?.find(
                                                                                                  (
                                                                                                    i: any,
                                                                                                  ) =>
                                                                                                    i.id ===
                                                                                                    representative.indicator,
                                                                                                );
                                                                                              const allQuestions =
                                                                                                indicatorObj?.standard_question ||
                                                                                                [];

                                                                                              // rebuild groupedQuestions for this indicator and set it
                                                                                              const grouped =
                                                                                                // groupQuestionsBySubindicator(
                                                                                                allQuestions;
                                                                                              //   );
                                                                                              // setGroupedQuestions(
                                                                                              //   grouped
                                                                                              // );

                                                                                              // compute fresh macroQuestions options for current subindicator (or global flattened if none)
                                                                                              const subId =
                                                                                                representative.subindicator ||
                                                                                                Object.keys(
                                                                                                  grouped,
                                                                                                )[0];
                                                                                              const questionOptions =
                                                                                                (
                                                                                                  grouped[
                                                                                                    subId
                                                                                                  ]
                                                                                                    ?.questions ||
                                                                                                  []
                                                                                                ).map(
                                                                                                  (
                                                                                                    q: any,
                                                                                                  ) => ({
                                                                                                    label: `${q.title} [${q.universal_question_id}]`,
                                                                                                    value:
                                                                                                      q.id,
                                                                                                  }),
                                                                                                ) ||
                                                                                                [];

                                                                                              setMacroQuestions(
                                                                                                questionOptions,
                                                                                              );
                                                                                              setMacroIndicators(
                                                                                                moduleObj?.indicators ||
                                                                                                  [],
                                                                                              );
                                                                                              // setMacroSubIndicators(
                                                                                              //   Object.values(
                                                                                              //     grouped
                                                                                              //   )
                                                                                              //     .filter(
                                                                                              //       (
                                                                                              //         g: any
                                                                                              //       ) =>
                                                                                              //         g.subindicator
                                                                                              //     )
                                                                                              //     .map(
                                                                                              //       (
                                                                                              //         g: any
                                                                                              //       ) => ({
                                                                                              //         label:
                                                                                              //           g
                                                                                              //             .subindicator
                                                                                              //             ?.name ||
                                                                                              //           'No Indicator',
                                                                                              //         value:
                                                                                              //           g
                                                                                              //             .subindicator
                                                                                              //             ?.id,
                                                                                              //       })
                                                                                              //     )
                                                                                              // );
                                                                                            } else {
                                                                                              // no formulas left: clear derived states so selects refresh immediately
                                                                                              // setGroupedQuestions(
                                                                                              //   {}
                                                                                              // );
                                                                                              setMacroQuestions(
                                                                                                [],
                                                                                              );
                                                                                              setMacroIndicators(
                                                                                                [],
                                                                                              );
                                                                                              // setMacroSubIndicators(
                                                                                              //   []
                                                                                              // );
                                                                                            }

                                                                                            // If you maintain any other derived state caches, recompute them here as well.
                                                                                          }}
                                                                                          >
                                                                                            Delete
                                                                                            Formula
                                                                                          </Button>
                                                                                        </div>
                                                                                        <div>
                                                                                          <Button
                                                                                            className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                                          // onClick={() =>
                                                                                          //   addFormula(
                                                                                          //     {
                                                                                          //       module:
                                                                                          //         '',
                                                                                          //       indicator:
                                                                                          //         '',
                                                                                          //       questions:
                                                                                          //         '',
                                                                                          //       macro_function:
                                                                                          //         '',
                                                                                          //     }
                                                                                          //   )
                                                                                          // }
                                                                                            onClick={() => {
                                                                                            const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;
                                                                                            const customFormulaPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`;

                                                                                            const current =
                                                                                              values
                                                                                                ?.widget_blocks?.[
                                                                                                blockIndex
                                                                                              ]
                                                                                                ?.widget_columns?.[
                                                                                                widgetIndex
                                                                                              ]
                                                                                                ?.widget_items?.[
                                                                                                widgetItemIndex
                                                                                              ]
                                                                                                ?.combined_parameters?.[
                                                                                                combinedParamIndex
                                                                                              ]
                                                                                                ?.custom_parameters?.[
                                                                                                customParameterIndex
                                                                                              ]
                                                                                                ?.formulas ||
                                                                                              [];

                                                                                            const newFormulas =
                                                                                              [
                                                                                                ...current,
                                                                                                {
                                                                                                  module:
                                                                                                    '',
                                                                                                  indicator:
                                                                                                    '',
                                                                                                  subindicator:
                                                                                                    '',
                                                                                                  questions:
                                                                                                    '',
                                                                                                  // macro_function:
                                                                                                  //   '',
                                                                                                },
                                                                                              ];

                                                                                            // atomically replace Formik array
                                                                                            setFieldValue(
                                                                                              formulasPath,
                                                                                              newFormulas,
                                                                                              false,
                                                                                            );

                                                                                            // update custom_formula display immediately
                                                                                            const display =
                                                                                              newFormulas
                                                                                                .map(
                                                                                                  (
                                                                                                    f: any,
                                                                                                  ) =>
                                                                                                    (Array.isArray(
                                                                                                      f.questions,
                                                                                                    )
                                                                                                      ? f.questions.join(
                                                                                                          ' + ',
                                                                                                        )
                                                                                                      : f.questions ||
                                                                                                        ''),
                                                                                                )
                                                                                                .filter(
                                                                                                  Boolean,
                                                                                                )
                                                                                                .join(
                                                                                                  ' + ',
                                                                                                );
                                                                                            setFieldValue(
                                                                                              customFormulaPath,
                                                                                              display,
                                                                                              false,
                                                                                            );

                                                                                            // clear/recompute cached option arrays so selects rebuild
                                                                                            // setGroupedQuestions(
                                                                                            //   {}
                                                                                            // );
                                                                                            setMacroQuestions(
                                                                                              [],
                                                                                            );
                                                                                            setMacroIndicators(
                                                                                              [],
                                                                                            );
                                                                                            // setMacroSubIndicators(
                                                                                            //   []
                                                                                            // );

                                                                                            // force remount of selects
                                                                                            setFormulaVersion(
                                                                                              (
                                                                                                v,
                                                                                              ) =>
                                                                                                v +
                                                                                                1,
                                                                                            );
                                                                                          }}
                                                                                          >
                                                                                            Add
                                                                                            Formula
                                                                                          </Button>
                                                                                        </div>
                                                                                      </div>
                                                                                    </div>
                                                                                  </div>
                                                                              )}
                                                                            </div>
                                                                          );
                                                                        },
                                                                      )}
                                                                    </div>
                                                                  )}
                                                                </FieldArray>
                                                                <div className="row mt-2">
                                                                  <div className="col-lg-12">
                                                                    <Field
                                                                      name={`widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.macro_function`}
                                                                    >
                                                                      {({
                                                                        field,
                                                                        form,
                                                                      }: FieldProps<string>) => {
                                                                        const formulasPath = `widget_blocks.${blockIndex}.widget_columns.${widgetIndex}.widget_items.${widgetItemIndex}.combined_parameters.${combinedParamIndex}.custom_parameters.${customParameterIndex}.formulas`;
                                                                        const formulas =
                                                                          form.getFieldMeta(
                                                                            formulasPath,
                                                                          )
                                                                            ?.value ||
                                                                          customParameter?.formulas ||
                                                                          [];

                                                                        const display =
                                                                          Array.isArray(
                                                                            formulas,
                                                                          )
                                                                            ? formulas
                                                                                .map(
                                                                                  (
                                                                                    f: any,
                                                                                  ) =>
                                                                                    (Array.isArray(
                                                                                      f?.questions,
                                                                                    )
                                                                                      ? f.questions.join(
                                                                                          ' + ',
                                                                                        )
                                                                                      : f?.questions ||
                                                                                        ''),
                                                                                  //     +
                                                                                  // (f?.macro_function
                                                                                  //   ? ` ${f.macro_function}`
                                                                                  //   : '')
                                                                                )
                                                                                .filter(
                                                                                  Boolean,
                                                                                )
                                                                                .join(
                                                                                  ' + ',
                                                                                )
                                                                            : '';

                                                                        // prefer explicit field value, otherwise show computed display
                                                                        const currentValue =
                                                                          field.value &&
                                                                          field.value !==
                                                                            ''
                                                                            ? field.value
                                                                            : display;

                                                                        return (
                                                                          <div>
                                                                            <label className="form-label">
                                                                              Custom
                                                                              Formula
                                                                            </label>
                                                                            <input
                                                                              {...field}
                                                                              type="text"
                                                                              className="form-control"
                                                                              placeholder="Enter Custom Formula"
                                                                              value={
                                                                                currentValue
                                                                              }
                                                                              onChange={(
                                                                                e,
                                                                              ) =>
                                                                                form.setFieldValue(
                                                                                  field.name,
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                                )}
                                                                            />
                                                                          </div>
                                                                        );
                                                                      }}
                                                                    </Field>
                                                                  </div>
                                                                </div>
                                                                <div className="d-flex justify-content-end gap-3 align-items-center adding-deleting-sites mt-3">
                                                                  <div>
                                                                    <Button
                                                                      onClick={() =>
                                                                        addCustomParameter(
                                                                          {
                                                                            label:
                                                                              [
                                                                                '',
                                                                              ],
                                                                            legends:
                                                                              [
                                                                                '',
                                                                              ],
                                                                            formulas:
                                                                              [
                                                                                {
                                                                                  module:
                                                                                    '',
                                                                                  indicator:
                                                                                    '',
                                                                                  questions:
                                                                                    '',
                                                                                  macro_function:
                                                                                    '',
                                                                                },
                                                                              ],
                                                                          },
                                                                        )}
                                                                      className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                    >
                                                                      Add Custom
                                                                      Parameter
                                                                    </Button>
                                                                  </div>
                                                                  <div>
                                                                    {(customParameterIndex >
                                                                      0 ||
                                                                      (customParameterIndex ===
                                                                        0 &&
                                                                        combinedParam
                                                                          ?.custom_parameters
                                                                          ?.length >
                                                                          1)) && (
                                                                          <Button
                                                                            onClick={async () => {
                                                                          if (
                                                                            actionType !==
                                                                            'Edit'
                                                                          ) {
                                                                            removeCustomParameter(
                                                                              customParameterIndex,
                                                                            );
                                                                          } else {
                                                                            const customId =
                                                                              values
                                                                                ?.widget_blocks?.[
                                                                                blockIndex
                                                                              ]
                                                                                ?.widget_columns?.[
                                                                                widgetIndex
                                                                              ]
                                                                                ?.widget_items?.[
                                                                                widgetItemIndex
                                                                              ]
                                                                                ?.combined_parameters?.[
                                                                                combinedParamIndex
                                                                              ]
                                                                                ?.custom_parameters?.[
                                                                                customParameterIndex
                                                                              ]
                                                                                ?.id;

                                                                            if (
                                                                              customId
                                                                            ) {
                                                                              try {
                                                                                const res =
                                                                                  await DashboardService.deleteCustomParameter(
                                                                                    customId,
                                                                                  );
                                                                                const {
                                                                                  success,
                                                                                  message,
                                                                                  error,
                                                                                } =
                                                                                  res?.data as {
                                                                                    success: boolean;
                                                                                    message: string;
                                                                                    error?: string[];
                                                                                  };

                                                                                if (
                                                                                  success
                                                                                ) {
                                                                                  toast.success(
                                                                                    message,
                                                                                  );
                                                                                  // await reloadWidgets(
                                                                                  //   widgetId
                                                                                  // );
                                                                                } else if (
                                                                                  error &&
                                                                                  error.length >
                                                                                    0
                                                                                ) {
                                                                                  toast.error(
                                                                                    error[0] as string,
                                                                                  ); // Show only server error
                                                                                }
                                                                                // If no error, do nothing
                                                                              } catch (err) {
                                                                                console.error(
                                                                                  'Failed to delete custom parameter:',
                                                                                  err,
                                                                                );
                                                                                toast.error(
                                                                                  'Failed to delete custom parameter',
                                                                                );
                                                                              }
                                                                            }
                                                                          }
                                                                        }}
                                                                            className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                                          >
                                                                            Delete
                                                                            Custom
                                                                            Parameter
                                                                          </Button>
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            ),
                                                          )}
                                                      </FieldArray>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          ),
                                        )}
                                        <h6>Preview</h6>
                                        <div
                                          className="border w-100 d-flex justify-content-center align-items-center"
                                          style={{
                                            height:
                                              values.widget_blocks?.[blockIndex]
                                                ?.widget_columns?.[widgetIndex]
                                                ?.widget_type === 'table'
                                                ? 600
                                                : 300,
                                          }}
                                        >
                                          <div
                                            style={{
                                              width:
                                                values.widget_blocks?.[
                                                  blockIndex
                                                ]?.widget_columns?.[widgetIndex]
                                                  ?.widget_type === 'table'
                                                  ? 600
                                                  : 300,
                                            }}
                                          >
                                            {/* {values.widget_blocks?.[blockIndex]
                                              ?.widget_columns?.[widgetIndex]
                                              ?.widget_type === 'table'
                                              ? getTableData(tableData)
                                              : getWidgetType(
                                                  values.widget_blocks?.[
                                                    blockIndex
                                                  ]?.widget_columns?.[
                                                    widgetIndex
                                                  ]
                                                )} */}
                                          </div>
                                        </div>
                                        <div className="d-flex justify-content-end gap-3 align-items-center adding-deleting-sites mt-3">
                                          <div>
                                            {(widgetIndex > 0 ||
                                              (widgetIndex === 0 &&
                                                block.widget_columns.length >
                                                  1)) && (
                                                  <Button
                                                    onClick={async () => {
                                                  const columnId =
                                                    values?.widget_blocks?.[
                                                      blockIndex
                                                    ]?.widget_columns?.[
                                                      widgetIndex
                                                    ]?.id;

                                                  if (actionType !== 'Edit') {
                                                    removeSite(widgetIndex);
                                                  } else if (columnId) {
                                                    try {
                                                      const res =
                                                        await DashboardService.deleteWidgetColumn(
                                                          columnId,
                                                        );
                                                      const {
                                                        success,
                                                        message,
                                                        error,
                                                      } = res?.data as {
                                                        success: boolean;
                                                        message: string;
                                                        error?: string[];
                                                      };

                                                      if (success) {
                                                        toast.success(message);
                                                        await reloadWidgets(
                                                          widgetId,
                                                        );
                                                      } else {
                                                        toast.error(
                                                          error?.[0] as string,
                                                        );
                                                      }
                                                    } catch (err) {
                                                      console.error(
                                                        'Failed to delete widget column:',
                                                        err,
                                                      );
                                                      toast.error(
                                                        'Failed to delete widget column',
                                                      );
                                                    }
                                                  }
                                                }}
                                                // text="Delete Site"
                                                    className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                                  >
                                                    Delete Widget
                                                  </Button>
                                            )}
                                          </div>
                                          {widgetIndex ===
                                            block.widget_columns.length - 1 && (
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                addSite({
                                                  widget_type: '',
                                                  chart_type: '',
                                                  isStacked: false,
                                                  isHorizontal: false,
                                                  isMetric: false,
                                                  widget_items: [
                                                    {
                                                      title: '',
                                                      filter: false,
                                                      filters: [],
                                                      combined_parameters: [
                                                        {
                                                          name: '',
                                                          custom_parameters: [
                                                            {
                                                              name: '',
                                                              formulas: [
                                                                {
                                                                  department:
                                                                    '',
                                                                  questions: '',
                                                                  macro_function:
                                                                    '',
                                                                },
                                                              ],
                                                              unit: '',
                                                              legends: [''],
                                                              label: [''],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                })}
                                              className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                              // btnclassName="business-btn"
                                            >
                                              Add Widget
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                            </FieldArray>
                            <div className="delete-unit d-flex justify-content-end">
                              {(blockIndex > 0 ||
                                (blockIndex === 0 &&
                                  values?.widget_blocks?.length > 1)) && (
                                  <Button
                                    onClick={async () => {
                                    // console.log(
                                    //   values?.widget_blocks?.[blockIndex]?.id,
                                    //   'block Id'
                                    // );

                                    if (actionType !== 'Edit') {
                                      removeBusinessUnit(blockIndex);
                                    } else {
                                      const blockId =
                                        values?.widget_blocks?.[blockIndex]?.id;
                                      if (blockId) {
                                        try {
                                          const res =
                                            await DashboardService.deleteWidgetBlock(
                                              blockId,
                                            );
                                          const { success, message, error } =
                                            res?.data as {
                                              success: boolean;
                                              message: string;
                                              error?: string[];
                                            };

                                          if (success) {
                                            toast.success(message);
                                            await reloadWidgets(widgetId);
                                          } else if (
                                            error &&
                                            error.length > 0
                                          ) {
                                            toast.error(error[0] as string); // Only show server error
                                          }
                                          // If no error returned, do nothing
                                        } catch (err) {
                                          console.error(
                                            'Failed to delete widget block:',
                                            err,
                                          );
                                          toast.error(
                                            'Failed to delete widget block',
                                          );
                                        }
                                      }
                                    }
                                  }}
                                    className="my-4 py-2 btn-sm px-sm-4 savebtn"
                                  >
                                    Delete Widget Block
                                  </Button>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                      {/* {!currentBusinessUnit && ( */}
                      <div className="d-flex justify-content-center">
                        <Button
                          // text=""
                          onClick={() =>
                            addBusinessUnit({
                              widget_columns: [
                                {
                                  widget_type: '',
                                  chart_type: '',
                                  isStacked: false,
                                  isHorizontal: false,
                                  isMetric: false,
                                  widget_items: [
                                    {
                                      title: '',
                                      filter: false,
                                      filters: [],
                                      combined_parameters: [
                                        {
                                          name: '',
                                          custom_parameters: [
                                            {
                                              name: '',
                                              formulas: [
                                                {
                                                  department: '',
                                                  questions: '',
                                                  macro_function: '',
                                                },
                                              ],
                                              unit: '',
                                              legends: [''],
                                              label: [''],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            })}
                          type="button"
                          className="my-4 py-2 btn-sm px-sm-4 savebtn"
                        >
                          Add Widget Block
                        </Button>
                      </div>
                      {/* )} */}
                    </div>
                  )}
                </FieldArray>
              </Col>
            </Row>

            <Stack direction="horizontal" className="justify-content-end ">
              <Button
                className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
                onClick={() => {
                  onClose?.();
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="my-4 py-2 btn-sm px-sm-4 savebtn"
                disabled={isSubmitting}
              >
                {btnName(isSubmitting, actionType)}
              </Button>
            </Stack>
          </form>
        );
      }}
    </Formik>
  );
}

export default AddOrEditDashboardWidgets;
