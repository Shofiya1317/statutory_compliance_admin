'use client';

import Badge from '@/components/Badge/Badge';
import { IComplianceScope } from '@/lib/interface/IComplianceScope.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import ComplianceScopeActionDropDown from './ComplianceScopeActionDropDown';

function ComplianceScopeItem({
  complianceScope,
}: {
  complianceScope: IComplianceScope;
}) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3 w-100 me-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {complianceScope?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(complianceScope.status, true)}
                className={getStatusColor(complianceScope.status, false)}
              >
                {complianceScope?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function ComplianceScopeList({
  complianceScopes,
}: {
  complianceScopes: IComplianceScope[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {complianceScopes?.map((item) => (
        <Accordion.Item
          eventKey={item.id}
          key={item.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <ComplianceScopeItem complianceScope={item} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Compliance Obligation
                    </span>
                    <h6 className="text-dark">{item?.compliance_obligation || '-'}</h6>
                  </div>
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
                <ComplianceScopeActionDropDown complianceScope={item} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
