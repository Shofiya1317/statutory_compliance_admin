'use client';

import Badge from '@/components/Badge/Badge';
import { IApplicabilityRules } from '@/lib/interface/IApplicabilityRules.interface';
import { formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import ApplicabilityRulesActionDropDown from './ApplicabilityRulesActionDropDown';

function ApplicabilityRulesItem({
  applicabilityRule,
}: {
  applicabilityRule: IApplicabilityRules;
}) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3 w-100 me-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {applicabilityRule?.name}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(applicabilityRule.status, true)}
                className={getStatusColor(applicabilityRule.status, false)}
              >
                {applicabilityRule?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function ApplicabilityRulesList({
  applicabilityRules,
}: {
  applicabilityRules: IApplicabilityRules[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {applicabilityRules?.map((item) => (
        <Accordion.Item
          eventKey={item.id}
          key={item.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <ApplicabilityRulesItem applicabilityRule={item} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Sector
                    </span>
                    <h6 className="fw-semibold text-primary">
                      {Array.isArray(item?.sector) ? item.sector.join(', ') : item?.sector || '-'}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Industries
                    </span>
                    <h6 className="text-dark">
                      {Array.isArray(item?.industries) ? item.industries.join(', ') : item?.industries || '-'}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      State
                    </span>
                    <h6 className="text-dark">
                      {Array.isArray(item?.state) ? item.state.join(', ') : item?.state || '-'}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Listing Status
                    </span>
                    <h6 className="text-dark">
                      {Array.isArray(item?.listing_status) ? item.listing_status.join(', ') : item?.listing_status || '-'}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Employee Count
                    </span>
                    <h6 className="text-dark">{item?.employee_count || '-'}</h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Revenue Band
                    </span>
                    <h6 className="text-dark">{item?.revenue_band || '-'}</h6>
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
                <ApplicabilityRulesActionDropDown applicabilityRule={item} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
