'use client';

import Badge from '@/components/Badge/Badge';
import { IIndustries } from '@/lib/interface/IIndustries.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import IndustryActionDowpDown from './IndustryActionDowpDown';

function Industry({ industry }: { industry: IIndustries }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {industry?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(industry.status, true)}
                className={getStatusColor(industry.status, false)}
              >
                {industry?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function IndustryList({
  industries,
}: {
  industries: IIndustries[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {industries?.map((industry) => (
        <Accordion.Item
          eventKey={industry.id}
          key={industry.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Industry industry={industry} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Sector
                    </span>
                    <h6 className=" text-capitalize">
                      {industry.sector?.name}
                    </h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(industry.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <IndustryActionDowpDown industry={industry} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
