/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */

'use client';

import {
  startTransition, useCallback, useEffect, useState,
} from 'react';
import Button from '@/components/Button/Button';
import { useModal } from '@/components/Modal/Context';
import toast from 'react-hot-toast';
import {
  IQuestionSequences,
  IStandard,
  IStandardTheme,
  IStandardQuestion,
} from '@/lib/interface/IStandard.interface';
import { StandardService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { Accordion, Stack } from 'react-bootstrap';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import LinkQuestions from '../LinkQuestions';

export default function LinkQuestionList({
  currentStandard,
  flag,
  token,
  searchParams,
}: {
  currentStandard: IStandard;
  flag: string;
  token: string;
  searchParams?: any;
}) {
  const router = useRouter();
  const hideModal = useModal({});
  const [themes, setThemes] = useState<IStandardTheme[]>([]);
  const [openThemes, setOpenThemes] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<{
    themeId: string;
    indicatorId: string;
    indicatorName: string;
    question?: IQuestionSequences;
    questionType: 'STANDARD';
  }>();

  /** parentQuestionId -> dependent questions */
  const [questionRulesMap, setQuestionRulesMap] = useState<{
    [parentQuestionId: string]: any[]; // rule objects
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentStandard?.standard_themes?.length) {
      setThemes(currentStandard.standard_themes);
    } else {
      setThemes([]);
    }
  }, [currentStandard]);

  /* ================= FETCH QUESTION RULES ================= */
  const fetchQuestionRules = useCallback(
    async (
      standardId: string,
      indicatorId: string,
      dependentQuestionId: string,
    ) => {
      const res = await StandardService.getQuestionRules(
        standardId,
        indicatorId,
        dependentQuestionId,
        token,
      );

      return res?.data || [];
    },
    [token],
  );

  const refreshRules = useCallback(async () => {
    const rulesMap: Record<string, Map<string, any>> = {};

    for (const theme of themes) {
      for (const indicator of theme.standard_indicators || []) {
        const dependentQuestions = indicator.standard_questions?.filter(
          (q: any) => q.is_dependent === true,
        ) || [];

        for (const dependent of dependentQuestions) {
          const rules = await fetchQuestionRules(
            currentStandard.id,
            indicator.id,
            dependent.id,
          );

          for (const rule of rules) {
            const parentId = rule.parent_question.id;

            if (!rulesMap[parentId]) {
              rulesMap[parentId] = new Map();
            }

            const depId = rule.dependent_question.id;

            if (rulesMap[parentId].has(depId)) {
              // ✅ Merge parent_option into existing entry
              const existing = rulesMap[parentId].get(depId);
              existing.parent_options = [
                ...existing.parent_options,
                rule.parent_option,
              ];
            } else {
              // ✅ First time seeing this dependent question
              rulesMap[parentId].set(depId, {
                ...rule,
                parent_options: rule.parent_option ? [rule.parent_option] : [],
              });
            }
          }
        }
      }
    }

    const finalRulesMap: Record<string, any[]> = {};
    Object.keys(rulesMap).forEach((parentId) => {
      finalRulesMap[parentId] = Array.from(rulesMap[parentId].values());
    });

    setQuestionRulesMap(finalRulesMap);
  }, [themes, currentStandard?.id, fetchQuestionRules]);

  useEffect(() => {
    if (themes.length && currentStandard?.id) {
      refreshRules();
    }
  }, [themes, currentStandard?.id, refreshRules]);

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await StandardService.deleteStandardRule(currentStandard.id, ruleId);

      // 🔄 refresh parent state
      refreshRules();
      router.refresh();
    } catch (error) {
      // console.error(error);
    }
  };

  /* ================= MODAL ================= */
  const modal = useModal({
    style: { size: 'lg', title: 'Add Rule Questions' },
    content: (
      <LinkQuestions
        currentStandard={currentStandard}
        currentQuestion={currentQuestion}
        token={token}
        onClose={() => {
          hideModal();
          setCurrentQuestion(undefined);
          router.refresh();
          refreshRules();
        }}
        onSuccess={() => {
          refreshRules();
        }}
      />
    ),
  });

  useEffect(() => {
    if (currentQuestion) modal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  /* ================= MOVE THEME ================= */
  const moveTheme = (from: number, to: number) => {
    setThemes((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        standard_id: currentStandard.id,
        themes: themes.map((theme: any, themeIndex: number) => ({
          id: theme.id,
          master_theme_id: theme.master_theme_id,
          name: theme.name,
          description: theme.description,
          weightage: theme.weightage,
          sequence: themeIndex + 1, // update sequence only

          indicators: (theme.standard_indicators || []).map(
            (indicator: any) => ({
              id: indicator.id,
              master_indicator_id: indicator.master_indicator_id,
              name: indicator.name,
              description: indicator.description,
              weightage: indicator.weightage,
              sequence: indicator.sequence,
              questions: (() => {
                let sequenceCounter = 1;
                const finalQuestions: any[] = [];

                const parentQuestions = indicator.standard_questions?.filter(
                  (q: any) => !q.is_dependent,
                ) || [];

                parentQuestions.forEach((parent: any) => {
                  // 1️⃣ Add parent first
                  finalQuestions.push({
                    ...parent,
                    sequence: sequenceCounter,
                  });
                  sequenceCounter += 1;
                  // 2️⃣ Add its dependent questions immediately after
                  const dependents = questionRulesMap[parent.id] || [];

                  dependents.forEach((rule: any) => {
                    const dependentQ = rule.dependent_question;

                    finalQuestions.push({
                      ...dependentQ,
                      sequence: sequenceCounter,
                    });
                    sequenceCounter += 1;
                  });
                });

                return finalQuestions.map((q: any) => ({
                  id: q.id,
                  master_question_id: q.master_question_id,
                  title: q.title,
                  description: q.description,
                  weightage: q.weightage,
                  sequence: q.sequence,
                  question_type: q.question_type,
                  placeholder: q.placeholder,
                  option_type: q.option_type,
                  universal_question_id: q.universal_question_id,
                  min_range: Number(q.min_range),
                  max_range: Number(q.max_range),

                  options: (q.standard_question_options || []).map(
                    (opt: any) => ({
                      id: opt.id,
                      master_option_id: opt.master_option_id,
                      text: opt.text,
                      value: opt.text.toLowerCase(),
                      weightage: Number(opt.weightage),
                    }),
                  ),

                  mixed_questions: (q.mixed_questions || []).map((mq: any) => ({
                    id: mq.id,
                    master_mixed_question_id: mq.master_mixed_question_id,
                    value_question_type: mq.value_question_type,
                    value_name: mq.value_name,
                    value_enum: mq.value_enum,
                    unit_name: mq.unit_name,
                    unit_type: mq.unit_type,
                    unit_enum: mq.unit_enum,
                  })),
                }));
              })(),
            }),
          ),
        })),
      };

      // console.log(payload, 'payload');

      const res = await StandardService.patchThemes(
        currentStandard.id,
        payload,
      );

      if (
        res?.data?.success
        && res?.data?.message === 'Standard themes updated successfully'
      ) {
        toast.success(res.data.message);
        router.push('/masters/standards');
      } else {
        toast.error(res?.data?.error[0] || 'Failed to update themes');
      }
    } catch (error) {
      toast.error('Something went wrong while updating themes');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <Accordion
        activeKey={openThemes}
        onSelect={(key) => setOpenThemes(key ? String(key) : null)}
      >
        {themes.map((theme, themeIndex) => (
          <Accordion.Item
            eventKey={theme.id}
            key={theme.id}
            className="mt-2 p-1"
          >
            {/* ================= THEME HEADER ================= */}
            <Accordion.Header>
              <div className="d-flex align-items-center gap-2">
                {themeIndex !== 0 && (
                  <BsFillArrowUpCircleFill
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTheme(themeIndex, themeIndex - 1);
                    }}
                  />
                )}

                {themeIndex !== themes.length - 1 && (
                  <BsFillArrowDownCircleFill
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTheme(themeIndex, themeIndex + 1);
                    }}
                  />
                )}

                <span className="fs-5 fw-semibold">{theme.name}</span>
              </div>
            </Accordion.Header>

            {/* ================= INDICATORS ================= */}
            <Accordion.Body>
              <Accordion alwaysOpen>
                {theme.standard_indicators.map((indicator) => (
                  <Accordion.Item eventKey={indicator.id} key={indicator.id}>
                    <Accordion.Header>
                      <span className="fs-5">
                        {indicator.name}
                        {indicator.weightage !== undefined
                          && indicator.weightage !== null && (
                            <span className="text-muted ms-2 fs-6">
                              (
                              {indicator.weightage}
                              %)
                            </span>
                        )}
                      </span>
                    </Accordion.Header>

                    {/* ================= QUESTIONS ================= */}
                    <Accordion.Body>
                      <div className="d-flex justify-content-end mb-2">
                        <Button
                          className="py-2 btn-sm px-sm-4 Cancelbtn"
                          onClick={() => {
                            setCurrentQuestion({
                              themeId: theme.id,
                              indicatorId: indicator.id,
                              indicatorName: indicator.name,
                              questionType: 'STANDARD',
                            });
                          }}
                        >
                          Add Rule Questions
                        </Button>
                      </div>

                      {(
                        indicator.standard_questions?.filter(
                          (q: any) => !q.is_dependent,
                        ) || []
                      ).map((question, index: number) => {
                        const dependents = questionRulesMap[question.id] || [];

                        return (
                          <li
                            key={question.id}
                            className="mb-2 border rounded p-3 d-flex flex-column"
                          >
                            {/* ===== PARENT QUESTION ===== */}
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                {index + 1}
                                .
                                {question.title}
                                {question.universal_question_id && (
                                  <span className="text-muted ms-1">
                                    (
                                    {question.universal_question_id}
                                    )
                                  </span>
                                )}
                                {' '}
                                {dependents.length > 0 && (
                                  <span className="text-muted small">
                                    (Parent Question)
                                  </span>
                                )}
                                {question.weightage !== undefined
                                  && question.weightage !== null && (
                                    <span className="text-muted ms-2 small fw-semibold">
                                      [
                                      {question.weightage}
                                      %]
                                    </span>
                                )}
                              </div>

                              {/* Question type aligned to right */}
                              <div
                                className="fw-semibold"
                                style={{ color: '#305B61' }}
                              >
                                {question.question_type
                                  ?.replace(/_/g, ' ')
                                  .toLowerCase()
                                  .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                              </div>
                            </div>

                            {/* ===== DEPENDENT QUESTIONS ===== */}
                            {dependents.map((rule: any) => (
                              <div
                                key={rule.id}
                                className="mt-3 small d-flex align-items-center justify-content-between"
                              >
                                <div className="d-flex align-items-center gap-1">
                                  <MdOutlineSubdirectoryArrowRight size={20} />
                                  <span>
                                    {rule.dependent_question.title}
                                    {rule.dependent_question
                                      .universal_question_id && (
                                      <span className="text-muted ms-1">
                                        (
                                        {
                                          rule.dependent_question
                                            .universal_question_id
                                        }
                                        )
                                      </span>
                                    )}
                                    {rule.dependent_question.weightage
                                      !== undefined
                                      && rule.dependent_question.weightage
                                        !== null && (
                                        <span className="text-muted ms-2 small fw-semibold">
                                          [
                                          {rule.dependent_question.weightage}
                                          %]
                                        </span>
                                    )}
                                    {' '}
                                    <span
                                      className="fw-semibold"
                                      style={{ color: '#305B61' }}
                                    >
                                      (
                                      {rule.dependent_question.question_type
                                        ?.replace(/_/g, ' ')
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                      )
                                    </span>
                                  </span>
                                </div>

                                <Button
                                  className="Cancelbtn btn-sm py-1 px-2"
                                  onClick={() => handleDeleteRule(rule.id)}
                                >
                                  Remove Rule
                                </Button>
                              </div>
                            ))}
                          </li>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* ================= ACTION BUTTONS ================= */}
      <Stack direction="horizontal" className="justify-content-end">
        <Button
          className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
          onClick={() => {
            window.location.href = `/masters/standards/${currentStandard?.id}/link_themes?t=${Date.now()}`;
          }}
        >
          Cancel
        </Button>

        <Button
          className="my-4 py-2 btn-sm px-sm-4 savebtn me-3"
          onClick={handleSubmit}
          disabled={isSubmitting} // Disable button when submitting
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>

        {/* <Button className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3">
          {currentStandard?.is_active ? 'Un-Publish' : 'Publish'}
        </Button> */}
      </Stack>
    </div>
  );
}
