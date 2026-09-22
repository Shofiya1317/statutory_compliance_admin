/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

'use client';

import React, { Suspense, useState } from 'react';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import './Analytics.css';
import { WidgetService } from '@/lib/service';
import PageNotFound from '../PageNotFound/PageNotFound';
// import WidgetCard from '../MasterList/Widgets/WidgetCard';
// import WidgetTextArea from '../MasterList/Widgets/WidgetTextArea';
// import WidgetChart from '../MasterList/Widgets/WidgetChart';
// import WidgetTable from '../MasterList/Widgets/WidgetTable';
// import WidgetIndicatorHeader from '../MasterList/Widgets/WidgetIndicatorHeader';

function IndicatorList({ initialIndicators }: { initialIndicators: any[] }) {
  const [indicators, setIndicators] = useState(initialIndicators);
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...indicators];
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    setIndicators(reordered);
  };
  const getColumn = (widgetColumnsLength: number) => {
    if (widgetColumnsLength === 2) {
      return 'col-lg-6';
    }
    if (widgetColumnsLength === 3) {
      return 'col-lg-4';
    }
    return 'col-lg-12';
  };

  const getWidgetType = (WidgetType: any) => {
    const customParameters = WidgetType?.widget_item?.[0]?.combined_parameters?.[0]?.custom_parameter;
    const labels = Array.from(
      new Set(customParameters?.map((item: any) => item.label)),
    );
    const flatLabels = Array.from(new Set(labels?.flat()));
    const legends = Array.from(
      new Set(customParameters?.map((item: any) => item.legends)),
    );
    const flatLegends = Array.from(new Set(legends?.flat()));
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

    // switch (WidgetType?.type) {
    //   case 'card':
    //     return <WidgetCard cardData={WidgetType?.widget_item[0]} />;
    //   case 'textArea':
    //     return <WidgetTextArea cardData={WidgetType?.widget_item[0]} />;
    //   case 'chart':
    //     const widgetItem = WidgetType?.widget_item?.[0];

    //     return (
    //       <WidgetChart
    //         title={WidgetType?.widget_item[0]?.title}
    //         isStacked={WidgetType?.is_stacked}
    //         isHorizontal={WidgetType?.is_horizontal}
    //         isMetric={WidgetType?.is_metric}
    //         type={WidgetType?.chart_type}
    //         isFilters={widgetItem?.filter}
    //         filters={widgetItem?.filters}
    //         // Including Stacked Bar Chart
    //         categories={
    //           WidgetType?.chart_type === 'pie'
    //           || WidgetType?.chart_type === 'donut'
    //           || WidgetType?.chart_type === 'radialBar'
    //             ? WidgetType?.widget_item?.[0]?.combined_parameters?.[0]?.custom_parameter
    //               ?.flatMap((item: any) => item.legends)
    //               .filter((legend: any) => legend.trim() !== '')
    //             : flatLabels?.filter(
    //               (label: any) => typeof label === 'string' && label.trim() !== '',
    //             )
    //         }
    //         // Including Stacked Bar Chart
    //         series={
    //           WidgetType?.chart_type === 'pie'
    //           || WidgetType?.chart_type === 'donut'
    //           || WidgetType?.chart_type === 'radialBar'
    //             ? customParameters.map((item: any) => item?.answer ?? 50)
    //             : flatLegends.map((legend) => ({
    //               name: legend,
    //               data: flatLabels.map((label) => {
    //                 const match = customParameters.find(
    //                   (item: any) => item.label === label && item.legends === legend,
    //                 );
    //                 return match?.answer ?? 50;
    //               }),
    //             }))
    //         }
    //         // categories={WidgetType?.widget_item[0]?.combined_parameters[0]?.custom_parameter
    //         //   ?.flatMap((item: any) => item.label)
    //         //   .filter((label: any) => label.trim() !== '')}

    //         // Previously used without Stacked bar
    //         // categories={
    //         //   WidgetType?.chart_type === 'pie' ||
    //         //   WidgetType?.chart_type === 'donut' ||
    //         //   WidgetType?.chart_type === 'radialBar'
    //         //     ? WidgetType?.widget_item?.[0]?.combined_parameters?.[0]?.custom_parameter
    //         //         ?.flatMap((item: any) => item.legends)
    //         //         .filter((legend: any) => legend.trim() !== '')
    //         //     : WidgetType?.widget_item?.[0]?.combined_parameters?.[0]?.custom_parameter
    //         //         ?.flatMap((item: any) => item.label)
    //         //         .filter(
    //         //           (label: any) =>
    //         //             typeof label === 'string' && label.trim() !== ''
    //         //         )
    //         // }

    //         // Previously used without Stacked bar
    //         // series={WidgetType?.widget_item[0]?.combined_parameters[0]?.custom_parameter?.map(
    //         //   (item: any) => {
    //         //     const seriesObj = {
    //         //       name: item?.legends,
    //         //       data: item?.answer ? [item?.answer] : [20],
    //         //     };
    //         //     if (
    //         //       WidgetType?.chart_type === 'pie'
    //         //       || WidgetType?.chart_type === 'donut'
    //         //     ) {
    //         //       return item?.answer ? [item?.answer] : 50;
    //         //     }
    //         //     if (WidgetType?.chart_type === 'radialBar') {
    //         //       return item?.answer ? [item?.answer] : [50];
    //         //     }
    //         //     return seriesObj;
    //         //   },
    //         // )}
    //       />
    //     );
    //   case 'table':
    //     return <WidgetTable columns={columns} data={data} />;
    // }
  };
  return (
    <div className="bg-white p-3 rounded-2" style={{ minHeight: '75vh' }}>
      {/* <h5 className="mb-3">Indicators</h5> */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="indicator-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {indicators.map((indicator, index) => (
                <Draggable
                  key={indicator.id}
                  draggableId={indicator.id}
                  index={index}
                >
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="mb-4 border p-2 rounded-2 bg-light"
                      style={{
                        ...dragProvided.draggableProps.style,
                        cursor: 'move',
                      }}
                    >
                      {/* <WidgetIndicatorHeader title={indicator.name} /> */}

                      {indicator?.widget_blocks
                        ?.sort(
                          (a: any, b: any) => (a?.sequence ?? 0) - (b?.sequence ?? 0),
                        )
                        ?.map((widget: any) => (
                          <div className="row mt-2" key={widget?.id}>
                            {widget?.widget_columns
                              ?.sort(
                                (a: any, b: any) => (a?.sequence ?? 0) - (b?.sequence ?? 0),
                              )
                              ?.map((column: any) => (
                                <div
                                  key={column?.id}
                                  className={`${getColumn(widget?.widget_columns?.length)} mb-3`}
                                >
                                  {/* {getWidgetType(column?.widget_types?.[0])} */}
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default function Analytics({
  token,
  modulesList,
}: {
  token: string;
  modulesList?: any[];
}) {
  const [moduleWidgets, setModuleWidgets] = useState<any>();
  const [moduleSelected, setModuleSelected] = useState<string | null>('');
  const [initialIndicators, setInitialIndicators] = useState<any[]>([]);

  const getModuleById = async (moduleId: string) => {
    const res = await WidgetService.getWidgetData(token, moduleId);
    const { data } = res.data as {
      success: boolean;
      data: any;
    };
    setModuleSelected(moduleId);
    setModuleWidgets(data[moduleId]);
    setInitialIndicators(data[moduleId]?.indicators || []);
  };

  return (
    <div className="row ms-1">
      <div className="col-12 col-md-3 bg-white">
        <div
          className="analytics_module_container py-4"
          // style={{ minHeight: '75vh', maxHeight: '100%' }}
        >
          <div className="px-3">
            <h6>Modules</h6>
            {/* {moduleList?.map((module) => (
                <div
                  key={module?.moduleName}
                  className={`d-flex justify-content-between gap-2 mt-3 is_radius ${
                    selectedModule === module?.moduleName ? 'active' : ''
                  }`}
                >
                  <div
                    className="p-2 py-3 d-flex flex-column gap-2 flex-grow-1"
                    aria-hidden
                    onClick={() => setSelectedModule(module?.moduleName)}
                    // onClick={() => {
                    //   getTask();
                    //   router.push(`?indicator=${indicator?.name}`);
                    // }}
                  >
                    <h6 className="fs-14 fw-600 mb-0 letter-spacing text-capitalize">
                      {module?.moduleName}
                    </h6>
                  </div>
                  <div>
                    <MdOutlineKeyboardDoubleArrowRight
                      size={24}
                      className="me-4"
                      color="#757575"
                    />
                  </div>
                </div>
              ))} */}
            {modulesList?.map((module) => (
              <div
                key={module?.name}
                className={`d-flex justify-content-between gap-2 mt-3 is_radius border ${
                  moduleSelected === module?.id ? 'active' : ''
                }`}
              >
                <div
                  className="p-2 py-3 d-flex flex-column gap-2 flex-grow-1"
                  aria-hidden
                  onClick={() => getModuleById(module?.id)}
                  // onClick={() => {
                  //   getTask();
                  //   router.push(`?indicator=${indicator?.name}`);
                  // }}
                >
                  <h6 className="fs-14 fw-600 mb-0 letter-spacing text-capitalize">
                    {module?.name}
                  </h6>
                </div>
                <div>
                  <MdOutlineKeyboardDoubleArrowRight
                    size={24}
                    className="me-4"
                    color="#757575"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-12 col-md-9">
        {moduleWidgets ? (
          <Suspense key={moduleWidgets?.id} fallback={<div>Loading...</div>}>
            <h4 className="fs-18 fw-700 mb-3">{moduleWidgets?.name}</h4>
            {/* {moduleWidgets?.indicators?.map((indicator: any) => {
              return (
                <div key={indicator?.id} style={{ cursor: 'move' }}>
                  <WidgetIndicatorHeader
                    title={indicator?.name}
                  ></WidgetIndicatorHeader>
                  {indicator?.widget_blocks?.map((widget: any) => {
                    return (
                      <div className="row mt-0" key={widget?.id}>
                        {widget?.widget_columns?.map(
                          (column: any, index: number) => {
                            return (
                              <div
                                className={`${getColumn(widget?.widget_columns?.length)} mb-3`}
                                key={widget?.id}
                              >
                                {getWidgetType(column?.widget_types?.[0])}
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })} */}
            <IndicatorList initialIndicators={initialIndicators} />
          </Suspense>
        ) : (
          <div className="bg-white">
            <PageNotFound />
          </div>
        )}
      </div>
    </div>
  );
}
