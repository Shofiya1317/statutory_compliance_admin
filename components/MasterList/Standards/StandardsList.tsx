/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import Badge from '@/components/Badge/Badge';
import { IStandard } from '@/lib/interface/IStandard.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import StandardsActionDowpDown from './StandardsActionDowpDown';

function Standards({ standard }: { standard: IStandard }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {standard?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  !standard.is_active ? 'DRAFT' : 'PUBLISH',
                  true,
                )}
                className={getStatusColor(
                  !standard.is_active ? 'DRAFT' : 'PUBLISH',
                  false,
                )}
              >
                {!standard.is_active ? 'Draft' : 'Publish'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function StandardsList({
  standards,
}: {
  standards: IStandard[] | any[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {standards?.map((standard) => (
        <Accordion.Item
          eventKey={standard.id}
          key={standard.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Standards standard={standard} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Modules
                    </span>
                    <h6 className=" text-capitalize">
                      {standard?.standard_modules?.map((item: any) => (
                        <div key={item?.id}>{item?.name}</div>
                      ))}
                    </h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(standard.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <StandardsActionDowpDown standard={standard} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
