'use client';

import Badge from '@/components/Badge/Badge';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import ModulesActionDowpDown from './ModulesActionDowpDown';

function Modules({ module }: { module: IThemes }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {module?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  module.is_deleted ? 'DELETED' : 'ACTIVE',
                  true,
                )}
                className={getStatusColor(
                  module.is_deleted ? 'DELETED' : 'ACTIVE',
                  false,
                )}
              >
                {module.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function ModulesList({ modules }: { modules: IThemes[] }) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {modules?.map((module) => (
        <Accordion.Item
          eventKey={module.id}
          key={module.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Modules module={module} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  {/* <div className="me-5">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Indicator
                    </span>
                    <h6 className=" text-capitalize">
                      {module?.indicators?.map((item) => (
                        <div key={item?.id}>{item?.name}</div>
                      )) || '-'}
                    </h6>
                  </div> */}

                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(module.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <ModulesActionDowpDown theme={module} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
