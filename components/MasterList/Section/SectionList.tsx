'use client';

import Badge from '@/components/Badge/Badge';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import SectionActionDowpDown from './SectionActionDowpDown';

function SectionItem({ section }: { section: any }) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {section?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(section.is_deleted ? 'DELETED' : 'ACTIVE', true)}
                className={getStatusColor(section.is_deleted ? 'DELETED' : 'ACTIVE', false)}
              >
                {section.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function SectionList({ sections }: { sections: any[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {sections?.map((section) => (
        <Accordion.Item
          eventKey={section.id}
          key={section.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <SectionItem section={section} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(section.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <SectionActionDowpDown section={section} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
