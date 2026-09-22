/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import Badge from '@/components/Badge/Badge';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import {
  convertToPascalCase,
  formatDateList,
  getStatusColor,
} from '@/lib/utils';
import { Accordion, Stack } from 'react-bootstrap';
import QuestionsActionDowpDown from './QuestionsActionDowpDown';

function Question({ question }: { question: IQuestion }) {
  return (
    <Stack>
      <div className="my-2">
        <div className=" d-flex align-items-center">
          <div className="d-flex justify-content-between ms-3">
            <h5 className="m-0 text-capitalize flex-grow-1 fw-normal text-dark">
              {question?.title}
            </h5>
            <div className="ms-4">
              <Badge
                bg={getStatusColor(
                  question.is_deleted ? 'DELETED' : 'ACTIVE',
                  true,
                )}
                className={getStatusColor(
                  question.is_deleted ? 'DELETED' : 'ACTIVE',
                  false,
                )}
              >
                {question.is_deleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default function QuestionsList({
  questions,
}: {
  questions: IQuestion[] | any[];
}) {
  return (
    <Accordion className="d-sm-block d-lg-none">
      {questions?.map((question) => (
        <Accordion.Item
          eventKey={question.id}
          key={question.id}
          className="mb-3 border-0"
        >
          <Accordion.Button
            className=" rounded-0"
            style={{ background: '#fefefe' }}
          >
            <Question question={question} />
          </Accordion.Button>
          <Accordion.Body>
            <div className="row">
              <div className="col-10">
                <div className="d-flex flex-wrap">
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Type
                    </span>
                    <h6
                      className="fw-semibold mb-0 text-start"
                      style={{ color: '#3485AE' }}
                    >
                      {convertToPascalCase(
                        question?.question_type
                          ?.replace('_SELECT', ' ')
                          ?.replace('_', ' ')
                          .replace('_', ' '),
                      )}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Module
                    </span>
                    <h6 className=" text-capitalize">
                      {question?.indicator?.module?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Indicator
                    </span>
                    <h6 className=" text-capitalize">
                      {question?.indicator?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Sub Indicator
                    </span>
                    <h6 className=" text-capitalize">
                      {question?.sub_indicator?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Department
                    </span>
                    <h6 className=" text-capitalize">
                      {question?.department?.name}
                    </h6>
                  </div>
                  <div className="me-5">
                    {' '}
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Universal Question ID
                    </span>
                    <h6 className=" text-capitalize">
                      {question?.universal_question_id}
                    </h6>
                  </div>
                  <div className="">
                    <span style={{ color: '#8F8F8F' }} className=" fw-normal">
                      Updated On
                    </span>
                    <h6 className="">{formatDateList(question.updatedAt)}</h6>
                  </div>
                </div>
              </div>
              <div className="col-2">
                <QuestionsActionDowpDown question={question} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
