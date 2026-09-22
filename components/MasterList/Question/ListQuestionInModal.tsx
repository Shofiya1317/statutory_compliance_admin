import Button from '@/components/Button/Button';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import Pagination from '@/components/Pagination/Pagination';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { IndicatorsService } from '@/lib/service';
import { convertToPascalCase } from '@/lib/utils';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionOptions from './QuestionOptions';

export default function ListQuestionInModal({
  optionId,
  dependentQuestion,
  setDependentQuestion,
}: {
  optionId: string[] | string | undefined;
  dependentQuestion: IQuestion[] | undefined;
  setDependentQuestion: (question: IQuestion[]) => void;
}) {
  console.error(optionId, 'optionId');
  const searchParams = useSearchParams();
  const [questionList, setQuestionList] = useState<IIndicator[]>([]);
  const [meta, setMeta] = useState<IMeta | undefined>();
  const urlParams = useParams();

  const getDetails = async () => {
    const res = await IndicatorsService.getAll({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    });
    const {
      indicators,
      success,
      meta: metaData,
    } = res?.data as {
      indicators: IIndicator[];
      success: boolean;
      meta: IMeta;
    };
    if (success) {
      setMeta(metaData);
      setQuestionList(indicators);
    }
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {questionList?.length > 0 ? (
        questionList?.map((indicator) => (
          <>
            <div className="d-flex justify-content-between">
              <h6
                className="text-dark fw-semibold "
                style={{
                  textUnderlineOffset: '5px',
                  textDecoration: 'underline 2px',
                  fontSize: '1rem',
                }}
              >
                {`${indicator?.name} (${indicator?.questions?.length})`}
              </h6>
            </div>
            {indicator?.questions?.map((qust: IQuestion, index: number) => (
              <div className="list_questions" key={qust?.id}>
                <div className="mb-3 border-0">
                  <div className="pb-3">
                    <div className="d-flex justify-content-between align-items-center flex-grow-1 flex-wrap pt-3">
                      <div
                        className="qust-width"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {`${index + 1} - ${qust?.title}`}
                      </div>
                      <div className="d-flex align-items-center flex-wrap">
                        <div style={{ width: '100px' }}>
                          <h6
                            className="fw-semibold mb-0 text-start"
                            style={{ color: '#3485AE' }}
                          >
                            {convertToPascalCase(
                              qust?.question_type
                                ?.replace('_SELECT', ' ')
                                .replace('_', ' '),
                            )}
                          </h6>
                        </div>
                        <div style={{ width: '100px' }} className="d-flex">
                          {qust?.id !== urlParams?.id && (
                            <Button
                              className="savebtn me-4"
                              onClick={() => {
                                let updatedDependentQuestion: IQuestion[];

                                if (dependentQuestion) {
                                  const isQuestionPresent = dependentQuestion.some(
                                    (item) => item.id === qust?.id,
                                  );

                                  if (isQuestionPresent) {
                                    updatedDependentQuestion = dependentQuestion?.filter(
                                      (item) => item.id !== qust?.id,
                                    );
                                  } else {
                                    updatedDependentQuestion = [
                                      ...dependentQuestion,
                                      { ...qust },
                                    ];
                                  }
                                } else {
                                  updatedDependentQuestion = [
                                    {
                                      ...qust,
                                      // question_option_id: optionId,
                                    },
                                  ];
                                }
                                setDependentQuestion(updatedDependentQuestion);
                              }}
                            >
                              {dependentQuestion?.find(
                                (item) => item?.id === qust?.id,
                              )
                                ? 'Added'
                                : 'Add'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-wrap pt-3">
                      <div>
                        <QuestionOptions question={qust} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ))
      ) : (
        <PageNotFound />
      )}

      {meta?.currentPage && (
        <div
          className=" position-sticky bottom-0 pt-3"
          style={{ background: '#fefefe ' }}
        >
          <Pagination
            meta={meta}
            currentPage={searchParams.get('page') || '1'}
            component="Indicators"
          />
        </div>
      )}
    </div>
  );
}
