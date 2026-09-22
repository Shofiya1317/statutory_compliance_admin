/* eslint-disable no-unsafe-optional-chaining */
import {
  IQuestion,
  IQuestionOption,
} from '@/lib/interface/IQuestions.interface';
import { Stack } from 'react-bootstrap';

export default function QuestionOptions({ question }: { question: IQuestion }) {
  return (
    <Stack className="">
      {['DATE', 'NUMBER', 'URL'].includes(question.question_type) && (
        <div className="my-3">
          <input
            type={question.question_type.toLowerCase()}
            disabled
            className=" w-100 p-2"
            style={{ background: '#3485ae26', border: '0px ' }}
            placeholder="Type..."
          />
        </div>
      )}

      {question.question_type === 'TEXT' && (
        <div className="my-3">
          <textarea
            disabled
            rows={5}
            className="w-100 p-2"
            style={{ background: '#3485ae26' }}
            placeholder="Descrption.."
          />
        </div>
      )}

      {question.question_type === 'FILE' && (
        <div className="my-3">
          <input type="file" disabled className="form-control" />
        </div>
      )}

      <div className="my-3">
        {question.question_type === 'SINGLE_SELECT'
          && question?.question_options?.map((option: IQuestionOption) => (
            <div key={option.id} className="d-flex align-items-center mb-3">
              <input type="radio" disabled />
              <span className="ms-2">
                {option.text || option?.value}
                <span>
                  {` ${
                    option?.dependent_question?.length > 0
                      ? `(${option?.dependent_question?.length})`
                      : ''
                  }`}
                </span>
              </span>
            </div>
          ))}
      </div>
      {question.question_type === 'MULTI_SELECT'
        && question?.question_options?.map((option: IQuestionOption) => (
          <Stack
            direction="horizontal"
            key={option.id}
            style={{ lineHeight: '2' }}
          >
            <input type="checkbox" disabled />
            <span className="ms-2">
              {option.text || option?.value}
              <span>
                {` ${
                  option?.dependent_question?.length > 0
                    ? `(${option?.dependent_question?.length})`
                    : ''
                }`}
              </span>
            </span>
          </Stack>
        ))}
    </Stack>
  );
}
