'use client';

import Badge from '@/components/Badge/Badge';
import { IComplianceRequirement } from '@/lib/interface/IComplianceRequirement.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import ComplianceRequirementActionDropDown from './ComplianceRequirementActionDropDown';

function ComplianceRequirementItem({
  complianceRequirement,
}: {
  complianceRequirement: IComplianceRequirement;
}) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3 w-100 me-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {complianceRequirement?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(complianceRequirement.status, true)}
                className={getStatusColor(complianceRequirement.status, false)}
              >
                {complianceRequirement?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function ComplianceRequirementList({
  complianceRequirements,
}: {
  complianceRequirements: IComplianceRequirement[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {complianceRequirements?.map((item) => (
        <Accordion.Item
          eventKey={item.id}
          key={item.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <ComplianceRequirementItem complianceRequirement={item} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Description
                    </span>
                    <h6 className="fw-normal text-secondary">
                      {item?.description || '-'}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Updated On
                    </span>
                    <h6>{formatDateList(item.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2 text-end">
                <ComplianceRequirementActionDropDown
                  complianceRequirement={item}
                />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
