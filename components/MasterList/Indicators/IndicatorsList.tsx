/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import Badge from '@/components/Badge/Badge';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import IndicatorsActionDowpDown from './IndicatorsActionDowpDown';

function Indicator({ indicator }: { indicator: IIndicator }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {indicator?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  indicator.is_deleted ? 'DELETED' : 'ACTIVE',
                  true,
                )}
                className={getStatusColor(
                  indicator.is_deleted ? 'DELETED' : 'ACTIVE',
                  false,
                )}
              >
                {indicator.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function IndicatorsList({
  indicators,
}: {
  indicators: IIndicator[] | any[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {indicators?.map((indicator) => (
        <Accordion.Item
          eventKey={indicator.id}
          key={indicator.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Indicator indicator={indicator} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Module
                    </span>
                    <h6 className=" text-capitalize">
                      {indicator?.module?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Questions Count
                    </span>
                    <h6 className=" text-capitalize">
                      {indicator?.questions?.length || 0}
                    </h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(indicator.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <IndicatorsActionDowpDown indicator={indicator} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
