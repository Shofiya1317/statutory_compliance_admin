/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from '@hello-pangea/dnd';
import { IDepartment } from '@/lib/interface/IDepartment.interface';
import { DashboardService, DepartmentService } from '@/lib/service';
import PageNotFound from '../PageNotFound/PageNotFound';
// import WidgetCard from '../MasterList/Widgets/WidgetCard';
// import WidgetTextArea from '../MasterList/Widgets/WidgetTextArea';
// import WidgetChart from '../MasterList/Widgets/WidgetChart';
// import WidgetTable from '../MasterList/Widgets/WidgetTable';
// import WidgetIndicatorHeader from '../MasterList/Widgets/WidgetIndicatorHeader';

interface IWidget {
  id: string;
  type: string;
  name?: string;
  title?: string;
  chart_type?: string;
  is_stacked?: boolean;
  is_horizontal?: boolean;
  is_metric?: boolean;
  widget_item?: any[];
}

interface IDashboardTab {
  id: string;
  name: string;
  widgets: IWidget[];
}

const getColumnClass = (widgetColumnsLength: number) => {
  if (widgetColumnsLength === 2) {
    return 'col-lg-6';
  }
  if (widgetColumnsLength === 3) {
    return 'col-lg-4';
  }
  return 'col-lg-12';
};

const getWidgetType = (WidgetType: any) => {
  const customParameters = WidgetType?.widget_item?.[0]?.dashboard_combined_parameters?.[0]
    ?.dashboard_custom_parameters || [];

  const allLabels = customParameters.flatMap((item: any) => {
    if (Array.isArray(item.label)) {
      return item.label
        .flat()
        .filter((l: any) => l && l.toString().trim() !== '')
        .map((l: any) => l.toString());
    }
    return item.label && item.label.toString().trim() !== ''
      ? [item.label.toString()]
      : [];
  });
  const labels = Array.from(new Set(allLabels)) as string[];

  const allLegends = customParameters.flatMap((item: any) => {
    if (Array.isArray(item.legends)) {
      return item.legends
        .flat()
        .filter((l: any) => l && l.toString().trim() !== '')
        .map((l: any) => l.toString());
    }
    return item.legends && item.legends.toString().trim() !== ''
      ? [item.legends.toString()]
      : [];
  });
  const legends = Array.from(new Set(allLegends)) as string[];
  const questionTexts = customParameters?.[0]?.question_texts || [];
  const columns = questionTexts.map((q: any, index: number) => ({
    key: `q${index}`, // unique key
    label: q.toLocaleLowerCase(), // lowercase label
  }));
  const data = [
    columns.reduce(
      (row: any, col: any) => {
        row[col.key] = 'nil';
        return row;
      },
      {} as Record<string, string>,
    ),
  ];

  const isCircularChart = WidgetType?.chart_type === 'pie'
    || WidgetType?.chart_type === 'donut'
    || WidgetType?.chart_type === 'radialBar';

  const hasValidData = labels.length > 0
    || legends.length > 0
    || customParameters.some((item: any) => item.answer !== null);

  // switch (WidgetType?.type) {
  //   case 'card':
  //     return <WidgetCard cardData={WidgetType?.widget_item?.[0]} />;

  //   case 'textArea':
  //     return <WidgetTextArea cardData={WidgetType?.widget_item?.[0]} />;

  //   case 'chart':
  //     let categories: string[];
  //     let series;

  //     if (!hasValidData) {
  //       categories = ['Sample Data'];
  //       series = isCircularChart ? [50] : [{ name: 'Sample', data: [50] }];
  //     } else if (isCircularChart) {
  //       // for cicrcular charts -> use legends as category
  //       categories = legends.length > 0
  //         ? legends
  //         : labels.length > 0
  //           ? labels
  //           : ['Category 1', 'Category 2'];
  //       series = customParameters.map((item: any, index: number) => (item.answer !== null && item.answer !== undefined ? item.answer : 50));

  //       if (series.length < categories.length) {
  //         const diff = categories.length - series.length;
  //         for (let i = 0; i < diff; i++) {
  //           series.push(50);
  //         }
  //       } else if (series.length > categories.length) {
  //         series = series.slice(0, categories.length);
  //       }
  //     } else {
  //       categories = labels.length > 0 ? labels : ['Category 1', 'Category 2'];

  //       if (legends.length > 0) {
  //         series = legends.map((legend) => ({
  //           name: legend,
  //           data: categories.map((category) => {
  //             const match = customParameters.find((item: any) => {
  //               const itemLabels = Array.isArray(item.label)
  //                 ? item.label.flat().map((l: any) => l.toString())
  //                 : [item.label?.toString()];
  //               const itemLegends = Array.isArray(item.legends)
  //                 ? item.legends.flat().map((l: any) => l.toString())
  //                 : [item.legends?.toString()];

  //               return (
  //                 itemLabels.includes(category) && itemLegends.includes(legend)
  //               );
  //             });
  //             return match?.answer ?? 50;
  //           }),
  //         }));
  //       } else {
  //         series = [
  //           {
  //             name: 'Values',
  //             data: categories.map(
  //               (category, index) => customParameters[index]?.answer ?? 50,
  //             ),
  //           },
  //         ];
  //       }
  //     }
  //     const widgetItem = WidgetType?.widget_item?.[0];

  //     return (
  //       <WidgetChart
  //         title={WidgetType?.widget_item?.[0]?.title}
  //         isStacked={WidgetType?.is_stacked}
  //         isHorizontal={WidgetType?.is_horizontal}
  //         isMetric={WidgetType?.is_metric}
  //         type={WidgetType?.chart_type}
  //         isFilters={widgetItem?.filter}
  //         filters={widgetItem?.filters}
  //         categories={categories}
  //         series={series}
  //       />
  //     );

  //   case 'table':
  //     return <WidgetTable columns={columns} data={data} />;

  //   default:
  //     return (
  //       <div>
  //         Unknown widget type:
  //         {WidgetType?.type}
  //       </div>
  //     );
  // }
};

function DashboardList({ dashboards }: { dashboards: any[] }) {
  if (!dashboards || dashboards.length === 0) {
    return <div className="text-center text-muted p-4">No Data Found</div>;
  }

  return (
    <div className="bg-white p-3 rounded-2" style={{ minHeight: '75vh' }}>
      {dashboards.map((dash) => (
        <div key={dash.id} className="mb-4 border p-2 rounded-2 bg-light">
          {/* <WidgetIndicatorHeader title={dash.name} /> */}

          {dash?.dashboard_blocks
            ?.sort((a: any, b: any) => (a?.sequence ?? 0) - (b?.sequence ?? 0))
            ?.map((block: any) => (
              <div className="row mt-2" key={block?.id}>
                {block?.dashboard_columns
                  ?.sort(
                    (a: any, b: any) => (a?.sequence ?? 0) - (b?.sequence ?? 0),
                  )
                  ?.map((column: any) => (
                    <div
                      key={column?.id}
                      className={`${getColumnClass(block?.dashboard_columns?.length)} mb-3`}
                    >
                      {column?.dashboard_types?.map((type: any) => getWidgetType(type))}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

const extractWidgetsFromTab = (tab: any): IWidget[] => {
  const widgets: IWidget[] = [];

  tab.dashboard_blocks?.forEach((block: any) => {
    block.dashboard_columns?.forEach((column: any) => {
      column.dashboard_types?.forEach((type: any) => {
        const widget: IWidget = {
          id: type.id,
          type: type.type,
          chart_type: type.chart_type,
          is_stacked: type.is_stacked,
          is_horizontal: type.is_horizontal,
          is_metric: type.is_metric,
          widget_item: type.dashboard_items || [],
        };
        widgets.push(widget);
      });
    });
  });

  return widgets;
};

const transformTabToIndicator = (tab: any) => ({
  id: tab.id,
  name: tab.name,
  dashboard_blocks: tab.dashboard_blocks?.map((block: any) => ({
    id: block.id,
    sequence: block.sequence,
    dashboard_columns: block.dashboard_columns?.map((column: any) => ({
      id: column.id,
      sequence: column.sequence,
      dashboard_types: column.dashboard_types?.map((type: any) => ({
        ...type,
        widget_item: type.dashboard_items,
      })),
    })),
  })),
});

// main function
export default function DashboardPreview({
  token,
  departments = [],
  standards,
}: {
  token: string;
  departments?: any[];
  standards?: any;
}) {
  // console.log(standards?.data, 'standards');

  // console.log(standards && standards.length > 0)
  // console.log(departments.length > 0, 'true/false')
  // console.log(standards.length >0, ' stand')
  const [departmentsName, setDepartments] = useState<IDepartment[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(
    null,
  );
  const [tabs, setTabs] = useState<IDashboardTab[]>([]);
  const [dashboard, setDashboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentService.getAll({}, token);
        const { departments: deptData } = res.data as {
          departments: IDepartment[];
        };
        setDepartments(deptData);

        if (deptData.length > 0 && !selectedDeptId) {
          setSelectedDeptId(deptData[0].id);
        }
      } catch (err) {
        console.error('Error fetching departments', err);
        setError('Failed to load departments.');
      }
    };
    loadDepartments();
  }, [token, selectedDeptId]);

  useEffect(() => {
    if (!selectedDeptId) return;

    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await DashboardService.getDashboardByDepartment(
          token,
          selectedDeptId,
        );
        const data = res?.data;

        if (
          data?.dashboards
          && Array.isArray(data.dashboards)
          && data.dashboards.length > 0
        ) {
          const dashboard = data.dashboards[0];

          if (dashboard.tabs && Array.isArray(dashboard.tabs)) {
            const extractedTabs: IDashboardTab[] = dashboard.tabs.map(
              (tab: any) => ({
                id: tab.id,
                name: tab.name,
                widgets: extractWidgetsFromTab(tab),
              }),
            );

            const transformedIndicators = dashboard.tabs.map(
              transformTabToIndicator,
            );

            setTabs(extractedTabs);
            setDashboard(transformedIndicators);
            setActiveTab(extractedTabs[0]?.id || null);
          } else {
            setTabs([]);
            setDashboard([]);
            setActiveTab(null);
          }
        } else {
          setTabs([]);
          setDashboard([]);
          setActiveTab(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to load dashboard data.');
        setTabs([]);
        setDashboard([]);
        setActiveTab(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedDeptId, token]);

  useEffect(() => {
    if (!selectedStandardId) return;

    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await DashboardService.getDashboardByStandard(
          token,
          selectedStandardId,
        );
        const data = res?.data;

        if (
          data?.dashboards
          && Array.isArray(data.dashboards)
          && data.dashboards.length > 0
        ) {
          const dashboard = data.dashboards[0];

          if (dashboard.tabs && Array.isArray(dashboard.tabs)) {
            const extractedTabs: IDashboardTab[] = dashboard.tabs.map(
              (tab: any) => ({
                id: tab.id,
                name: tab.name,
                widgets: extractWidgetsFromTab(tab),
              }),
            );

            const transformedIndicators = dashboard.tabs.map(
              transformTabToIndicator,
            );

            setTabs(extractedTabs);
            setDashboard(transformedIndicators);
            setActiveTab(extractedTabs[0]?.id || null);
          } else {
            setTabs([]);
            setDashboard([]);
            setActiveTab(null);
          }
        } else {
          setTabs([]);
          setDashboard([]);
          setActiveTab(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to load dashboard data.');
        setTabs([]);
        setDashboard([]);
        setActiveTab(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedStandardId, token]);

  const activeDashboard = dashboard.find((i) => i.id === activeTab);

  if (error) {
    return (
      <div className="row ms-1">
        <div className="col-12">
          <PageNotFound message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="row ms-1">
      <div className="col-12 col-md-3 bg-white">
        <div className="analytics_module_container py-4">
          <div className="px-3">
            {departments && departments.length > 0 && (
              <>
                <h6 className="mt-4">Departments</h6>
                {departments.map((dept) => (
                  <div
                    key={dept?.id}
                    className={`d-flex justify-content-between gap-2 mt-3 is_radius border ${
                      selectedDeptId === dept?.id ? 'active' : ''
                    }`}
                  >
                    <div
                      className="p-2 py-3 flex-grow-1"
                      aria-hidden
                      onClick={() => setSelectedDeptId(dept?.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="fs-14 fw-600 mb-0 text-capitalize">
                        {dept?.name}
                      </h6>
                    </div>
                    <MdOutlineKeyboardDoubleArrowRight
                      size={24}
                      className="me-4"
                      color="#757575"
                    />
                  </div>
                ))}
              </>
            )}

            {standards?.data && standards?.data.length > 0 && (
              <>
                <h6 className="mt-4">Standards</h6>
                {standards.data.map((standard: any) => (
                  <div
                    key={standard?.id}
                    className={`d-flex justify-content-between gap-2 mt-3 is_radius border ${
                      selectedStandardId === standard?.id ? 'active' : ''
                    }`}
                  >
                    <div
                      className="p-2 py-3 flex-grow-1"
                      aria-hidden
                      onClick={() => setSelectedStandardId(standard?.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="fs-14 fw-600 mb-0 text-capitalize">
                        {standard?.name}
                      </h6>
                    </div>
                    <MdOutlineKeyboardDoubleArrowRight
                      size={24}
                      className="me-4"
                      color="#757575"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-md-9">
        {tabs.length > 0 && (
          <div
            className="d-flex border-bottom mb-4"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom:
                    activeTab === tab.id
                      ? '3px solid #f39c12'
                      : '3px solid transparent',
                  backgroundColor:
                    activeTab === tab.id ? '#FFFDED' : 'transparent',
                  color: activeTab === tab.id ? '#000' : '#6c757d',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                }}
              >
                {tab.name}
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : !activeDashboard ? (
          <div className="bg-white">
            <PageNotFound message="No Tabs found" />
          </div>
        ) : (
          <Suspense key={activeTab} fallback={<div>Loading...</div>}>
            <DashboardList dashboards={[activeDashboard]} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
