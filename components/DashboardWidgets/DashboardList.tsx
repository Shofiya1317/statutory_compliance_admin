/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */

'use client';

import Badge from '@/components/Badge/Badge';
// import { IDepartment } from '@/lib/interface/IDepartment.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import DashboardActionDropDown from './DashboardActionDropDown';

function Widget({ widget }: { widget: any }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {widget?.dashboard?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  widget.is_deleted ? 'DELETED' : 'ACTIVE',
                  true,
                )}
                className={getStatusColor(
                  widget.is_deleted ? 'DELETED' : 'ACTIVE',
                  false,
                )}
              >
                {widget.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function DashboardList({ widgets }: { widgets: any[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {widgets?.map((widget) => (
        <Accordion.Item
          eventKey={widget.id}
          key={widget.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Widget widget={widget} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Department
                    </span>
                    <h6 className=" text-capitalize">
                      {widget?.department?.name}
                    </h6>
                  </div>
                  {/* <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Tab Name
                    </span>
                    <h6 className=" text-capitalize">
                      {widget?.tabs[0]?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      No.of Blocks
                    </span>
                    <h6>{widget?.number_of_blocks}</h6>
                  </div> */}
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      No.of Tabs
                    </span>
                    <h6 className=" text-capitalize">{widget?.tabs.length}</h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(widget.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <DashboardActionDropDown widget={widget} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
