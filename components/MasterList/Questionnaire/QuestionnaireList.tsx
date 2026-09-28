'use client';

import Badge from '@/components/Badge/Badge';
import { IQuestionnaire } from '@/lib/interface/IQuestionnaire.interface';
import { convertToPascalCase, formatDateList, getStatusColor } from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import QuestionnaireActionDropDown from './QuestionnaireActionDropDown';

function QuestionnaireItem({
  questionnaire,
}: {
  questionnaire: IQuestionnaire;
}) {
  return (
    <Stack>
      <div className="my-2">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3 w-100 me-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {questionnaire?.title}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(questionnaire.status, true)}
                className={getStatusColor(questionnaire.status, false)}
              >
                {questionnaire?.status?.replace('_', ' ') || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function QuestionnaireList({
  questionnaires,
}: {
  questionnaires: IQuestionnaire[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {questionnaires?.map((item) => (
        <Accordion.Item
          eventKey={item.id}
          key={item.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className="rounded-0"
            style={{ background: '#fefefe' }}
          >
            <QuestionnaireItem questionnaire={item} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Question Type
                    </span>
                    <h6 className="fw-semibold text-primary">
                      {convertToPascalCase(item?.type?.replace('_', ' '))}
                    </h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Compliance Scope
                    </span>
                    <h6 className="text-dark">{item?.compliance_scope || '-'}</h6>
                  </div>
                  <div>
                    <span style={{ color: '#8F8F8F' }} className="fw-normal">
                      Universal Question ID
                    </span>
                    <h6 className="fw-medium text-dark">{item?.universal_question_id || '-'}</h6>
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
                <QuestionnaireActionDropDown questionnaire={item} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
