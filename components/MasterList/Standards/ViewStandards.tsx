/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

'use client';

import {
  IStandard,
  IStandardQuestionOption,
  IStandardTheme,
} from '@/lib/interface/IStandard.interface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Accordion, Stack } from 'react-bootstrap';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { StandardService } from '@/lib/service';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';

export default function ViewStandards({
  currentStandard,
  flag,
  token,
  searchParams,
}: {
  currentStandard: IStandard;
  flag: string;
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any;
}) {
  const router = useRouter();
  const [themes, setThemes] = useState<IStandardTheme[]>([]);
  const [openThemes, setOpenThemes] = useState<string | null>(null);
  const [questionRulesMap, setQuestionRulesMap] = useState<{
    [parentQuestionId: string]: any[];
  }>({});

  // --- Translation state ---
  const SUPPORTED_LANGUAGES = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!selectedLangs.length) {
      toast.error('Please select at least one language');
      return;
    }
    try {
      setIsTranslating(true);
      const res = await StandardService.translateStandard(
        currentStandard.id,
        selectedLangs,
        token,
      );
      const data = res?.data as any;
      if (data?.success) {
        toast.success(data.message || 'Questions translated successfully!');
      } else {
        toast.error('Translation failed. Please try again.');
      }
    } catch {
      toast.error('Translation request failed. Check your API key.');
    } finally {
      setIsTranslating(false);
    }
  };

  const fetchQuestionRules = async (
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
  };

  const refreshRules = async () => {
    const rulesMap: Record<string, Map<string, any>> = {};

    await Promise.all(
      themes.flatMap((theme) => (theme.standard_indicators || []).flatMap((indicator) => {
        const dependentQuestions = indicator.standard_questions?.filter(
          (q: any) => q.is_dependent === true,
        ) || [];

        return dependentQuestions.map(async (dependent: any) => {
          const rules = await fetchQuestionRules(
            currentStandard.id,
            indicator.id,
            dependent.id,
          );

          rules.forEach((rule: any) => {
            const parentId = rule.parent_question.id;
            const depId = rule.dependent_question.id; // ✅ key by dependent question id

            if (!rulesMap[parentId]) {
              rulesMap[parentId] = new Map();
            }

            if (rulesMap[parentId].has(depId)) {
              // ✅ Merge parent_option into existing entry
              const existing = rulesMap[parentId].get(depId);
              existing.parent_options = [
                ...existing.parent_options,
                rule.parent_option,
              ];
            } else {
              // ✅ First occurrence — store with parent_options array
              rulesMap[parentId].set(depId, {
                ...rule,
                parent_options: rule.parent_option
                  ? [rule.parent_option]
                  : [],
              });
            }
          });
        });
      })),
    );

    const finalRulesMap: Record<string, any[]> = {};
    Object.keys(rulesMap).forEach((parentId) => {
      finalRulesMap[parentId] = Array.from(rulesMap[parentId].values());
    });

    setQuestionRulesMap(finalRulesMap);
  };

  useEffect(() => {
    if (themes.length && currentStandard?.id) {
      refreshRules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themes, currentStandard?.id]);

  useEffect(() => {
    if (currentStandard?.standard_themes?.length) {
      setThemes(currentStandard.standard_themes);
    } else {
      setThemes([]);
    }
  }, [currentStandard]);

  /* ================= UI ================= */
  return (
    <div>
      <Accordion
        activeKey={openThemes}
        onSelect={(key) => setOpenThemes(key ? String(key) : null)}
      >
        {themes.map((theme) => (
          <Accordion.Item
            eventKey={theme.id}
            key={theme.id}
            className="mt-2 p-1"
          >
            {/* ================= THEME HEADER ================= */}
            <Accordion.Header>
              <div className="d-flex align-items-center gap-2">
                <span className="fs-5 fw-semibold">{theme.name}</span>
              </div>
            </Accordion.Header>

            {/* ================= INDICATORS ================= */}
            <Accordion.Body>
              <Accordion alwaysOpen>
                {theme.standard_indicators.map((indicator) => (
                  <Accordion.Item eventKey={indicator.id} key={indicator.id}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="fs-5">{indicator.name}</span>
                        <span className="text-muted small fw-semibold">
                          Weightage:
                          {' '}
                          {indicator.weightage ?? 0}
                        </span>
                      </div>
                    </Accordion.Header>

                    {/* ================= QUESTIONS ================= */}
                    <Accordion.Body>
                      {(
                        indicator.standard_questions.filter(
                          (q: any) => !q.is_dependent, // ✅ show only parent questions
                        ) || []
                      ).map((question, index: number) => {
                        const dependents = questionRulesMap[question.id] || [];

                        return (
                          <li
                            key={question.id}
                            className="mb-2 border rounded p-3 d-flex flex-column"
                          >
                            {/* ===== QUESTION ===== */}
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                {index + 1}
                                .
                                {question.title}
                                {' '}
                                (
                                {question.universal_question_id}
                                )
                                {dependents.length > 0 && (
                                <span className="text-muted small ms-2">
                                  (Parent Question)
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

                            {/* ===== WEIGHTAGE ===== */}
                            <div className="text-muted small mt-1">
                              Weightage:
                              {' '}
                              <strong>{question.weightage ?? 0}</strong>
                            </div>

                            {/* ===== OPTIONS ===== */}
                            {['SINGLE_SELECT', 'MULTI_SELECT'].includes(
                              question.question_type,
                            )
                              && question.standard_question_options?.length
                                > 0 && (
                                <div className="mt-3 ps-3">
                                  <div className="fw-semibold text-secondary mb-2">
                                    Question Options
                                  </div>

                                  <ul className="list-unstyled mb-0">
                                    {question.standard_question_options.map(
                                      (
                                        option: IStandardQuestionOption,
                                        optIndex: number,
                                      ) => (
                                        <li
                                          key={option.id ?? optIndex}
                                          className="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2 bg-light"
                                        >
                                          {/* LEFT */}
                                          <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold">
                                              {optIndex + 1}
                                              )
                                            </span>
                                            <span>{option.text}</span>
                                          </div>

                                          {/* RIGHT */}
                                          <span className="text-muted small">
                                            Weightage:
                                            {' '}
                                            <strong>
                                              {option.weightage ?? 0}
                                            </strong>
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                            )}

                            {/* ===== DEPENDENT (RULE) QUESTIONS ===== */}
                            {dependents.map((rule: any) => {
                              const dq = rule.dependent_question;

                              return (
                                <div
                                  key={rule.id}
                                  className="mt-3 ps-4 border-start border-2 border-muted"
                                >
                                  {/* ===== DEPENDENT QUESTION HEADER ===== */}
                                  <div className="text-muted">
                                    <div className="d-flex align-items-center gap-2">
                                      <MdOutlineSubdirectoryArrowRight
                                        size={20}
                                      />
                                      <span>
                                        {dq.title}
                                        {' '}
                                        (
                                        {dq.universal_question_id}
                                        )
                                        {' '}
                                        <span
                                          className="fw-semibold"
                                          style={{ color: '#305B61' }}
                                        >
                                          (
                                          {dq.question_type
                                            ?.replace(/_/g, ' ')
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                          )
                                        </span>
                                      </span>
                                    </div>

                                    {/* Weightage */}
                                    <div className="small mt-1 ps-4">
                                      Weightage:
                                      {' '}
                                      <strong>{dq.weightage ?? 0}</strong>
                                    </div>
                                  </div>

                                  {/* ===== DEPENDENT OPTIONS (SINGLE / MULTI) ===== */}
                                  {['SINGLE_SELECT', 'MULTI_SELECT'].includes(
                                    dq.question_type,
                                  )
                                    && dq.standard_question_options?.length
                                      > 0 && (
                                      <div className="mt-2 ps-4">
                                        <div className="fw-semibold text-secondary mb-2 small">
                                          Question Options
                                        </div>

                                        <ul className="list-unstyled mb-0">
                                          {dq.standard_question_options.map(
                                            (
                                              option: IStandardQuestionOption,
                                              optIndex: number,
                                            ) => (
                                              <li
                                                key={option.id ?? optIndex}
                                                className="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2 bg-light small"
                                              >
                                                {/* LEFT */}
                                                <div className="d-flex align-items-center gap-2">
                                                  <span className="fw-semibold">
                                                    {optIndex + 1}
                                                    )
                                                  </span>
                                                  <span>{option.text}</span>
                                                </div>

                                                {/* RIGHT */}
                                                <span className="text-muted">
                                                  Weightage:
                                                  {' '}
                                                  <strong>
                                                    {option.weightage ?? 0}
                                                  </strong>
                                                </span>
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                  )}
                                </div>
                              );
                            })}
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

      {/* ================= TRANSLATE QUESTIONS SECTION ================= */}
      <div
        className="mt-4 p-4 border rounded"
        style={{ background: '#f9fafb' }}
      >
        <h6 className="fw-semibold mb-3" style={{ color: '#305B61' }}>
          🌐 Translate Questions
        </h6>
        <p className="text-muted small mb-3">
          Select languages and click Translate to auto-translate all questions
          and options in this standard using Google Translate.
        </p>

        <div className="d-flex gap-4 mb-3 flex-wrap">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={selectedLangs.includes(lang.code)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLangs((prev) => [...prev, lang.code]);
                  } else {
                    setSelectedLangs((prev) => prev.filter((l) => l !== lang.code));
                  }
                }}
                style={{ accentColor: '#305B61', width: 16, height: 16 }}
              />
              <span className="small fw-medium">{lang.label}</span>
            </label>
          ))}
        </div>

        <Button
          className="savebtn px-4"
          onClick={handleTranslate}
          disabled={isTranslating || !selectedLangs.length}
        >
          {isTranslating ? '⏳ Translating...' : '🌐 Translate Questions'}
        </Button>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <Stack direction="horizontal" className="justify-content-end" />
    </div>
  );
}
