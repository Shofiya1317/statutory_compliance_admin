'use client';

import Badge from '@/components/Badge/Badge';
import { ISector } from '@/lib/interface/ISector.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import SectorActionDowpDown from './SectorActionDowpDown';

function Sector({ sector }: { sector: ISector }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {sector?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(sector.status, true)}
                className={getStatusColor(sector.status, false)}
              >
                {sector?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function SectorList({ sectors }: { sectors: ISector[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {sectors?.map((sector) => (
        <Accordion.Item
          eventKey={sector.id}
          key={sector.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Sector sector={sector} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Industries
                    </span>
                    <h6 className=" text-capitalize">
                      {sector?.industry?.map((item) => (
                        <div key={item?.id}>{item?.name}</div>
                      ))}
                    </h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(sector.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <SectorActionDowpDown sector={sector} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
