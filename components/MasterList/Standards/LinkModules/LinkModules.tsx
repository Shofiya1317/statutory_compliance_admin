/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */

'use client';

import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { Loader } from '@/components/Loader/Loader';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { IStandard } from '@/lib/interface/IStandard.interface';
import {
  StandardService,
  ThemeService,
  IndicatorsService,
  QuestionService,
} from '@/lib/service';
import { convertToPascalCase, findModules, getStatusColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
  DragEvent,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { FormGroup, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsGripVertical,
  BsTrash,
} from 'react-icons/bs';
import './linkmodules.css';

type IndicatorOption = {
  id: string;
  name: string;
};

export default function LinkModules({
  currentStandardData,
  flag,
  token,
  searchParams,
}: {
  currentStandardData: IStandard;
  flag: string;
  token: string;
  searchParams?: any;
}) {
  const [currentStandard, setCurrentStandard] = useState<IStandard>(currentStandardData);

  const fetchCurrentStandards = async () => {
    if (!currentStandard?.id || !token) {
      return;
    }

    try {
      const res = await StandardService.getStandardById(
        currentStandard.id,
        token,
      );
      const standard = res.data.data as IStandard;
      setCurrentStandard(standard);
    } catch (error) {
      //  console.log(error)
    }
  };

  const router = useRouter();

  const [hasThemes, setHasThemes] = useState(
    currentStandardData?.standard_themes?.length > 0,
  );

  const [isLoading, setIsLoading] = useState(false);

  // ── Delete confirmation modal ──────────────────────────────────────────────
  type DeleteTarget = {
    type: 'theme';
    themeId: string;
    standardThemeId: string;
    name: string;
  } | null;
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<IndicatorOption[]>([]);
  const [indicatorQuestionsOrder, setIndicatorQuestionsOrder] = useState<
    Record<string, string[]>
  >({});

  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<
    Record<string, any[]>
  >({});
  const [draggedQuestion, setDraggedQuestion] = useState<{
    indicatorId: string;
    questionIndex: number;
  } | null>(null);
  const [indicatorWeightage, setIndicatorWeightage] = useState<
    Record<string, number | undefined>
  >({});

  const [questionWeightage, setQuestionWeightage] = useState<
    Record<string, number | undefined>
  >({});

  const [optionWeightage, setOptionWeightage] = useState<
    Record<string, number | undefined>
  >({});

  const [baseIndicators, setBaseIndicators] = useState<IndicatorOption[]>([]);

  const filterParams = {
    page: searchParams?.page || '1',
    limit: searchParams?.limit || '2000',
    search: searchParams?.search || '',
    status: searchParams?.status || '',
    sort: searchParams?.sort || '-createdAt',
    sector_name: searchParams?.sector_name || '',
    industry_name: searchParams?.industry_name || '',
    industry_id: searchParams?.industry_id || '',
    module_name: searchParams?.module_name || '',
    module_id: searchParams?.module_id || '',
    question_type: searchParams?.question_type || '',
    standard_name: searchParams?.standard_name || '',
    standard_id: searchParams?.standard_id || '',
    indicator_name: searchParams?.indicator_name || '',
    indicator_id: searchParams?.indicator_id || '',
  };

  const getThemes = async () => {
    const res = await ThemeService.getAll();
    const { data } = res.data as { data: any[] };

    setThemes(data || []);
  };

  const fetchIndicators = async () => {
    try {
      const response: any = await IndicatorsService.getAll(filterParams);

      const mappedIndicators = (response.data?.indicators || []).map(
        (indicator: any) => ({
          id: indicator.id,
          name: indicator.name,
        }),
      );

      setBaseIndicators(mappedIndicators); // ✅ SOURCE OF TRUTH
      setIndicators(mappedIndicators); // 👁 UI list
    } catch (error) {
      // console.error('Failed to fetch indicators', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response: any = await QuestionService.getAll(filterParams);
      setAllQuestions(response.data?.questions || []);
    } catch (error) {
      // console.error('Failed to fetch questions', error);
    }
  };

  useEffect(() => {
    getThemes();
    fetchIndicators();
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getQuestionsForIndicator = (indicatorId: string) => allQuestions.filter((q) => q.indicator?.id === indicatorId);

  // Refs declared before all functions that use them (no-use-before-define)
  const originalQuestionsRef = useRef<Record<string, string[]>>({}); // Stores standard question IDs
  const questionIdMappingRef = useRef<Record<string, string>>({}); // Maps master_question_id -> standard_question_id
  const standardIndicatorIdMappingRef = useRef<Record<string, string>>({}); // Maps master_indicator_id -> standard_indicator_id
  const standardThemeIdMappingRef = useRef<Record<string, string>>({}); // Maps master_theme_id -> standard_theme_id

  const toggleIndicator = async (indicatorId: string) => {
    const indicatorQuestions = getQuestionsForIndicator(indicatorId);
    const questionIds = indicatorQuestions.map((q) => q.id);
    const isCurrentlySelected = selectedIndicators.includes(indicatorId);

    // 🔥 WHEN UNCHECKING — DELETE indicator via API (backend cascades questions)
    if (isCurrentlySelected) {
      // 🔥 DELETE the standard indicator itself (if it was saved)
      // Backend will cascade-delete all linked standard questions automatically
      const standardIndicatorId = standardIndicatorIdMappingRef.current[indicatorId];
      if (standardIndicatorId) {
        try {
          await StandardService.deleteStandardIndicator(
            standardIndicatorId,
            token,
          );
          // Clean up refs
          delete standardIndicatorIdMappingRef.current[indicatorId];
          delete originalQuestionsRef.current[indicatorId];
          questionIds.forEach((masterQId) => {
            delete questionIdMappingRef.current[masterQId];
          });
        } catch (error) {
          console.error('Error deleting indicator:', error);
          toast.error('Failed to delete indicator');
          return;
        }
      }

      setSelectedQuestions((prevQ) => {
        const copy = { ...prevQ };
        delete copy[indicatorId];
        return copy;
      });

      setIndicatorQuestionsOrder((prevOrder) => {
        const copy = { ...prevOrder };
        delete copy[indicatorId];
        return copy;
      });

      setIndicatorWeightage((prev) => {
        const copy = { ...prev };
        delete copy[indicatorId];
        return copy;
      });

      setQuestionWeightage((prev) => {
        const copy = { ...prev };
        questionIds.forEach((qid) => delete copy[qid]);
        return copy;
      });

      setOptionWeightage((prev) => {
        const copy = { ...prev };
        indicatorQuestions.forEach((q) => {
          q.question_options?.forEach((opt: any) => {
            delete copy[opt.id];
          });
        });
        return copy;
      });

      setSelectedIndicators((prev) => prev.filter((id) => id !== indicatorId));
      return;
    }

    // ✅ WHEN CHECKING — initialize defaults
    setSelectedQuestions((prevQ) => ({
      ...prevQ,
      [indicatorId]: questionIds,
    }));

    setIndicatorQuestionsOrder((prevOrder) => ({
      ...prevOrder,
      [indicatorId]: questionIds,
    }));

    setSelectedIndicators((prev) => [...prev, indicatorId]);
  };

  const toggleQuestion = async (indicatorId: string, questionId: string) => {
    const existing = selectedQuestions[indicatorId] || [];
    const isRemoving = existing.includes(questionId);

    // 🔥 CLEAR WEIGHTAGES WHEN UNCHECKING
    if (isRemoving) {
      // clear question weightage
      setQuestionWeightage((prevQ) => {
        const copy = { ...prevQ };
        delete copy[questionId];
        return copy;
      });

      // clear option weightages
      const questionObj = allQuestions.find((q) => q.id === questionId);

      if (questionObj?.question_options?.length) {
        setOptionWeightage((prevOpt) => {
          const copy = { ...prevOpt };
          questionObj.question_options.forEach((opt: any) => {
            delete copy[opt.id];
          });
          return copy;
        });
      }

      // 🔥 CALL DELETE API using standard_questions.id (NOT master_question_id)
      const standardQuestionId = questionIdMappingRef.current[questionId];
      if (standardQuestionId) {
        try {
          await StandardService.deleteStandardQuestion(
            standardQuestionId,
            token,
          );
          // Remove from originalQuestionsRef so it won't be re-deleted on submit
          if (originalQuestionsRef.current[indicatorId]) {
            originalQuestionsRef.current[indicatorId] = originalQuestionsRef.current[indicatorId].filter(
              (id) => id !== standardQuestionId,
            );
          }
          // Remove from mapping ref since it's deleted
          delete questionIdMappingRef.current[questionId];
        } catch (error) {
          console.error('Error deleting question:', error);
          toast.error('Failed to delete question');
          return; // Don't update UI if delete failed
        }
      }
    }

    setSelectedQuestions((prev) => {
      const existing = prev[indicatorId] || [];
      return {
        ...prev,
        [indicatorId]: isRemoving
          ? existing.filter((id) => id !== questionId) // ❌ uncheck
          : [...existing, questionId], // ✅ check
      };
    });
  };

  const getOrderedQuestions = useCallback(
    (indicatorId: string) => {
      const order = indicatorQuestionsOrder[indicatorId] || [];

      return order
        .map((id) => allQuestions.find((q) => q.id === id))
        .filter(Boolean);
    },
    [indicatorQuestionsOrder, allQuestions],
  );

  const areAllQuestionsSelected = (indicatorId: string) => {
    const questions = getOrderedQuestions(indicatorId);
    const selected = selectedQuestions[indicatorId] || [];

    if (!questions.length) return false;

    return questions.every((q) => selected.includes(q.id));
  };

  const toggleAllQuestions = async (indicatorId: string) => {
    const questions = getOrderedQuestions(indicatorId);
    const allIds = questions.map((q) => q.id);
    const existing = selectedQuestions[indicatorId] || [];
    const isAllSelected = questions.length > 0 && questions.every((q) => existing.includes(q.id));

    if (isAllSelected) {
      // 🔥 UNSELECT ALL — call delete API for all saved questions in parallel
      const savedQuestions = questions.filter((q) => !!questionIdMappingRef.current[q.id]);
      const deletePromises = savedQuestions.map((q) => {
        const standardQuestionId = questionIdMappingRef.current[q.id];
        return StandardService.deleteStandardQuestion(standardQuestionId, token)
          .then(() => {
            // Clean up refs after each successful delete
            if (originalQuestionsRef.current[indicatorId]) {
              originalQuestionsRef.current[indicatorId] = originalQuestionsRef.current[indicatorId].filter(
                (id) => id !== standardQuestionId,
              );
            }
            delete questionIdMappingRef.current[q.id];
          });
      });

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error('Error deleting questions:', error);
        toast.error('Failed to delete some questions');
        return; // Don't update UI if any delete failed
      }

      // Clear weightages for all questions
      setQuestionWeightage((prev) => {
        const c = { ...prev };
        questions.forEach((q) => { delete c[q.id]; });
        return c;
      });
      setOptionWeightage((prev) => {
        const c = { ...prev };
        questions.forEach((q) => {
          q.question_options?.forEach((opt: any) => { delete c[opt.id]; });
        });
        return c;
      });

      // Update selection state after all deletes succeeded
      setSelectedQuestions((prev) => ({ ...prev, [indicatorId]: [] }));
    } else {
      // ✅ SELECT ALL — just update state, no API call needed
      setSelectedQuestions((prev) => ({ ...prev, [indicatorId]: allIds }));
    }
  };

  useEffect(() => {
    if (!allQuestions.length) return;

    setSelectedQuestions((prev) => {
      const updated = { ...prev };

      selectedIndicators.forEach((indicatorId) => {
        if (!updated[indicatorId]) {
          const qs = getOrderedQuestions(indicatorId);
          updated[indicatorId] = qs.map((q) => q.id);
        }
      });

      return updated;
    });
  }, [allQuestions, selectedIndicators, getOrderedQuestions]);

  // ── FIX: removed the delete API call from here.
  // Clearing the select (X) now only resets UI state.
  // The delete API is called ONLY via the "Delete Theme" button → executeDelete().
  const handleThemeChange = (themeId: string | null) => {
    setSelectedTheme(themeId);

    /* ---------- HARD RESET ---------- */
    setSelectedIndicators([]);
    setSelectedQuestions({});
    setIndicatorWeightage({});
    setQuestionWeightage({});
    setOptionWeightage({});
    setIndicatorQuestionsOrder({});

    // Clear the mapping when theme changes
    questionIdMappingRef.current = {};
    standardIndicatorIdMappingRef.current = {};

    if (!themeId || !currentStandard?.standard_themes?.length) return;

    const theme = currentStandard.standard_themes.find(
      (t: any) => t.master_theme_id === themeId,
    );

    if (!theme) return;

    const sortedIndicators = [...theme.standard_indicators].sort(
      (a: any, b: any) => a.sequence - b.sequence,
    );

    const indicatorIds: string[] = [];
    const indicatorWeight: Record<string, number> = {};
    const questionWeight: Record<string, number> = {};
    const optionWeight: Record<string, number> = {};
    const selectedQ: Record<string, string[]> = {};
    const questionOrder: Record<string, string[]> = {};

    // Store original STANDARD QUESTION IDs for deletion tracking
    const originalStandardQuestionIds: Record<string, string[]> = {};

    // Store theme mapping: master_theme_id -> standard_theme_id
    standardThemeIdMappingRef.current[themeId] = theme.id;

    sortedIndicators.forEach((ind: any) => {
      const indicatorId = ind.master_indicator_id;
      indicatorIds.push(indicatorId);
      indicatorWeight[indicatorId] = ind.weightage ?? 0;

      // Store indicator mapping: master_indicator_id -> standard_indicator_id
      standardIndicatorIdMappingRef.current[indicatorId] = ind.id;

      const themeQuestions = (ind.standard_questions || []).sort(
        (a: any, b: any) => a.sequence - b.sequence,
      );

      // Get master question IDs for UI display
      const themeMasterQuestionIds = themeQuestions.map(
        (q: any) => q.master_question_id,
      );

      // Store STANDARD question IDs for deletion API
      const themeStandardQuestionIds = themeQuestions.map(
        (q: any) => q.id, // 👈 This is the actual standard question ID
      );

      // Store original standard question IDs for this indicator
      originalStandardQuestionIds[indicatorId] = [...themeStandardQuestionIds];

      // Create mapping: master_question_id -> standard_question_id
      themeQuestions.forEach((q: any) => {
        questionIdMappingRef.current[q.master_question_id] = q.id;
      });

      const allIndicatorQuestionIds = allQuestions
        .filter(
          (q) => q.indicator?.id === indicatorId && q.is_dependent !== true,
        )
        .map((q) => q.id);

      const remaining = allIndicatorQuestionIds.filter(
        (id) => !themeMasterQuestionIds.includes(id),
      );

      questionOrder[indicatorId] = [...themeMasterQuestionIds, ...remaining];
      selectedQ[indicatorId] = [...themeMasterQuestionIds];

      themeQuestions.forEach((q: any) => {
        questionWeight[q.master_question_id] = q.weightage ?? 0;

        (q.standard_question_options || []).forEach((stdOpt: any) => {
          const masterQuestion = allQuestions.find(
            (aq) => aq.id === q.master_question_id,
          );

          const matchingMasterOption = masterQuestion?.question_options?.find(
            (mOpt: any) => mOpt.text === stdOpt.text,
          );

          if (matchingMasterOption) {
            optionWeight[matchingMasterOption.id] = Number(
              stdOpt.weightage ?? 0,
            );
          }
        });
      });
    });

    // Store original standard question IDs in ref for later use in deletion
    originalQuestionsRef.current = originalStandardQuestionIds;

    /* ✅ REORDER FROM CLEAN BASE */
    setIndicators(() => {
      const themeSet = new Set(indicatorIds);

      const themeIndicators = baseIndicators
        .filter((i) => themeSet.has(i.id))
        .sort(
          (a, b) => indicatorIds.indexOf(a.id) - indicatorIds.indexOf(b.id),
        );

      const otherIndicators = baseIndicators.filter((i) => !themeSet.has(i.id));

      return [...themeIndicators, ...otherIndicators];
    });

    setSelectedIndicators(indicatorIds);
    setIndicatorWeightage(indicatorWeight);
    setQuestionWeightage(questionWeight);
    setOptionWeightage(optionWeight);
    setSelectedQuestions(selectedQ);
    setIndicatorQuestionsOrder(questionOrder);
  };

  const rearrangeItems = <T, >(list: T[], from: number, to: number): T[] => {
    const updated = [...list];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
  };

  const rearrangeIndicators = (from: number, to: number) => {
    setIndicators((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const rearrangeQuestions = (
    indicatorId: string,
    from: number,
    to: number,
  ) => {
    setIndicatorQuestionsOrder((prev) => ({
      ...prev,
      [indicatorId]: rearrangeItems(prev[indicatorId], from, to),
    }));
  };

  const handleDragStart = (
    e: DragEvent,
    indicatorId: string,
    questionIndex: number,
  ) => {
    setDraggedQuestion({ indicatorId, questionIndex });

    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (indicatorId: string, targetIndex: number) => {
    if (!draggedQuestion) return;

    if (draggedQuestion.indicatorId !== indicatorId) return;

    rearrangeQuestions(indicatorId, draggedQuestion.questionIndex, targetIndex);

    setDraggedQuestion(null);
  };

  const handleDragEnd = (e: DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const resetStates = () => {
    setSelectedTheme(null);
    setSelectedIndicators([]);
    setSelectedQuestions({});
    setIndicatorWeightage({});
    setQuestionWeightage({});
    setOptionWeightage({});
    setIndicatorQuestionsOrder({});
    setDraggedQuestion(null);

    // optional but GOOD → restore original indicator order
    setIndicators(baseIndicators);
  };

  const validateForm = (): boolean => {
    /* ---------- THEME ---------- */
    if (!selectedTheme) {
      toast.error('Please select a theme');
      return false;
    }

    /* ---------- INDICATORS ---------- */
    if (selectedIndicators.length === 0) {
      toast.error('Please select at least one indicator');
      return false;
    }

    /* ---------- INDICATOR WEIGHTAGE ---------- */
    if (currentStandard?.is_weightage) {
      const hasInvalidIndicatorWeight = selectedIndicators.some(
        (indicatorId) => {
          const weight = indicatorWeightage[indicatorId];
          return weight === undefined || weight === null;
        },
      );

      if (hasInvalidIndicatorWeight) {
        toast.error('Please enter weightage for all selected indicators');
        return false;
      }
    }

    /* ---------- QUESTIONS ---------- */
    const hasInvalidQuestions = selectedIndicators.some((indicatorId) => {
      const questions = selectedQuestions[indicatorId] || [];

      if (questions.length === 0) {
        toast.error('Each selected indicator must have at least one question');
        return true; // stop
      }

      if (currentStandard?.is_weightage) {
        const invalidQuestion = questions.some((qId) => {
          const qWeight = questionWeightage[qId];

          if (qWeight === undefined || qWeight === null) {
            toast.error('Please enter weightage for all selected questions');
            return true;
          }

          /* ---------- OPTIONS ---------- */
          const questionObj = allQuestions.find((q) => q.id === qId);

          if (
            ['SINGLE_SELECT', 'MULTI_SELECT'].includes(
              questionObj?.question_type,
            )
          ) {
            const options = questionObj?.question_options?.filter(
              (o: any) => !o.is_deleted,
            ) || [];

            const invalidOption = options.some((opt: any) => {
              const optWeight = optionWeightage[opt.id];
              return optWeight === undefined || optWeight === null;
            });

            if (invalidOption) {
              toast.error(
                `Please enter weightage for all options in "${questionObj.title}"`,
              );
              return true;
            }
          }

          return false;
        });

        if (invalidQuestion) return true;
      }

      return false;
    });

    if (hasInvalidQuestions) return false;

    return true;
  };

  // ── Confirm & execute delete ───────────────────────────────────────────────
  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'theme') {
        const { themeId, standardThemeId } = deleteTarget;

        // Delete the entire standard theme (cascade deletes indicators + questions on backend)
        await StandardService.deleteStandardTheme(standardThemeId, token);

        // Clean up refs
        delete standardThemeIdMappingRef.current[themeId];
        standardIndicatorIdMappingRef.current = {};
        questionIdMappingRef.current = {};
        originalQuestionsRef.current = {};

        // Reset all state
        resetStates();
        setHasThemes(false);

        toast.success(`Theme "${deleteTarget.name}" deleted successfully`);
        await fetchCurrentStandards();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(`Failed to delete ${deleteTarget.type}. Please try again.`);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!currentStandard || !selectedTheme) return;

      const selectedThemeObj = themes.find((t) => t.id === selectedTheme);

      // Check if theme exists
      const themeExists = currentStandard.standard_themes?.some(
        (t) => t.master_theme_id === selectedTheme,
      );

      // NOTE: Deletions for unchecked questions/indicators are handled
      // in real-time via toggleQuestion() and toggleIndicator() using standard_questions.id.

      // Prepare payload
      const payload = {
        standard_id: currentStandard.id,
        themes: [
          {
            name: selectedThemeObj?.name || '',
            description: '',
            sequence: 1,
            weightage: 0,
            master_theme_id: selectedTheme,
            indicators: indicators
              .filter((ind) => selectedIndicators.includes(ind.id))
              .map((ind, indIndex) => ({
                name: ind.name,
                sequence: indIndex + 1,
                weightage: indicatorWeightage[ind.id] ?? 0,
                description: '',
                master_indicator_id: ind.id,
                questions: (indicatorQuestionsOrder[ind.id] || [])
                  .filter((questionId) => selectedQuestions[ind.id]?.includes(questionId))
                  .map((questionId: string, qIndex: number) => {
                    const q = allQuestions.find((aq) => aq.id === questionId);
                    if (!q) return undefined;
                    return {
                      title: q.title,
                      sequence: qIndex + 1,
                      weightage: questionWeightage[q.id] ?? 0,
                      description: q.description ?? '',
                      question_type: q.question_type,
                      placeholder: q.placeholder ?? '',
                      option_type: q.option_type ?? '',
                      universal_question_id: q.universal_question_id,
                      master_question_id: q.id,
                      min_range: q.min_range ?? 0,
                      max_range: q.max_range ?? 0,
                      options: (
                        q.standard_question_options
                        || q.question_options
                        || []
                      )
                        .filter((o: any) => o.is_deleted === false)
                        .map((o: any) => ({
                          text: o.text,
                          value: o.value || o.text?.toLowerCase(),
                          master_option_id: o.id,
                          weightage: Number(
                            optionWeightage[o.id] ?? o.weightage ?? 0,
                          ),
                        })),
                      mixed_questions:
                        q.question_type === 'MIXED_TYPE'
                          ? (q.mixed_type_questions || []).map((mq: any) => ({
                            value_question_type: mq.value_question_type,
                            value_name: mq.value_name,
                            value_enum: mq.value_enum ?? [],
                            unit_name: mq.unit_name,
                            unit_type: mq.unit_type,
                            unit_enum: mq.unit_enum ?? [],
                            master_mixed_question_id: mq.id,
                          }))
                          : [],
                    };
                  })
                  .filter((q): q is NonNullable<typeof q> => !!q),
              })),
          },
        ],
      };

      let res;

      if (themeExists) {
        res = await StandardService.patchThemes(currentStandard.id, payload);
      } else {
        res = await StandardService.createThemes(currentStandard.id, payload);
      }

      const apiSuccess = res?.data?.success;
      const apiMessage = res?.data?.message || res?.data?.error || 'Failed to save theme';

      if (apiSuccess) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });
        resetStates();
        toast.success(
          apiMessage
            || (themeExists
              ? 'Theme updated successfully!'
              : 'Theme created successfully!'),
        );
        setHasThemes(true);
        await fetchCurrentStandards();

        // Clear refs after successful save
        originalQuestionsRef.current = {};
        questionIdMappingRef.current = {};
      } else {
        toast.error(apiMessage);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const themeOptions = useMemo(
    () => themes.map((theme) => ({
      label: theme.name,
      value: theme.id,
    })),
    [themes],
  );

  return (
    <div className="link-modules-wrapper">
      {/* Themes */}
      <div className="d-flex align-items-end gap-2">
        <div className="w-25" style={{ minWidth: 260 }}>
          <CustomInputField
            validationSchema={undefined}
            label="Themes"
            error={undefined}
            field={{ name: 'theme_id', value: selectedTheme }}
            isCustomRequired
          >
            <CustomSelect
              id="theme_id"
              isMulti={false}
              isDisabled={false}
              value={
                themeOptions.find((opt: any) => opt.value === selectedTheme)
                ?? null
              }
              options={themeOptions}
              onChange={(e: any) => handleThemeChange(e?.value ?? null)}
            />
          </CustomInputField>
        </div>

        {/* Delete Theme button — only visible when a SAVED theme is selected */}
        {selectedTheme && standardThemeIdMappingRef.current[selectedTheme] && (
          <button
            type="button"
            title="Delete this theme"
            className="d-flex align-items-center gap-1"
            style={{
              height: 38,
              whiteSpace: 'nowrap',
              border: '1px solid #305B61',
              color: '#305B61',
            }}
            onClick={() => {
              const themeName = themeOptions.find((t) => t.value === selectedTheme)?.label
                || 'this theme';
              setDeleteTarget({
                type: 'theme',
                themeId: selectedTheme,
                standardThemeId:
                  standardThemeIdMappingRef.current[selectedTheme],
                name: themeName,
              });
            }}
          >
            <BsTrash size={14} color="#305B61" />
            Delete Theme
          </button>
        )}
      </div>

      {/* Indicators and Questions */}
      <div className="module-list mt-4">
        {indicators.map((indicator, indicatorIndex) => {
          const isSelected = selectedIndicators.includes(indicator.id);
          const questions = getOrderedQuestions(indicator.id);

          return (
            <div
              key={indicator.id}
              className={`module-item ${isSelected ? 'selected' : ''}`}
            >
              {/* INDICATOR */}
              <div className="d-flex align-items-center gap-2 w-100 roleCheckbox">
                {/* LEFT SIDE */}
                <div className="d-flex align-items-center gap-2 flex-grow-1">
                  {indicatorIndex !== 0 && (
                    <BsFillArrowUpCircleFill
                      onClick={(e) => {
                        e.stopPropagation();
                        rearrangeIndicators(indicatorIndex, indicatorIndex - 1);
                      }}
                    />
                  )}

                  {indicatorIndex !== indicators.length - 1 && (
                    <BsFillArrowDownCircleFill
                      onClick={(e) => {
                        e.stopPropagation();
                        rearrangeIndicators(indicatorIndex, indicatorIndex + 1);
                      }}
                    />
                  )}

                  {/* ✅ TOGGLE ONLY HERE */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleIndicator(indicator.id)}
                  />

                  <span className="ms-2 fs-5 fw-semibold">
                    {indicator.name}
                  </span>
                </div>

                {/* RIGHT SIDE – WEIGHTAGE */}
                {currentStandard?.is_weightage && (
                  <input
                    type="number"
                    min={0}
                    className="form-control form-control-sm"
                    style={{ width: 110 }}
                    placeholder="Weightage"
                    value={indicatorWeightage[indicator.id] ?? ''}
                    onChange={(e) => {
                      const { value } = e.target;
                      setIndicatorWeightage((prev) => ({
                        ...prev,
                        [indicator.id]:
                          value === '' ? undefined : Number(value),
                      }));
                    }}
                  />
                )}
              </div>

              {isSelected && questions.length > 0 && (
                <button
                  type="button"
                  className="px-2 m-3 btn-sm Cancelbtn ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllQuestions(indicator.id);
                  }}
                >
                  {areAllQuestionsSelected(indicator.id)
                    ? 'Unselect All'
                    : 'Select All'}
                </button>
              )}

              {/* QUESTIONS */}
              {isSelected && (
                <ul className="indicator-list mt-2">
                  {questions.map((question, qIndex) => (
                    <li
                      key={question.id}
                      className="mb-2 border rounded p-2"
                      draggable
                      onDragStart={(e) => handleDragStart(e, indicator.id, qIndex)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(indicator.id, qIndex)}
                    >
                      <div className="d-flex align-items-center gap-2 w-100 roleCheckbox">
                        {/* LEFT */}
                        <div className="d-flex align-items-center gap-2 flex-grow-1">
                          <BsGripVertical />
                          <input
                            type="checkbox"
                            checked={
                              selectedQuestions[indicator.id]?.includes(
                                question.id,
                              ) ?? false
                            }
                            onChange={() => toggleQuestion(indicator.id, question.id)}
                          />
                          <span>
                            {qIndex + 1}
                            .
                            {question.title}
                            {' '}
                            (
                            {question.universal_question_id}
                            )
                          </span>
                        </div>

                        {/* RIGHT – WEIGHTAGE — only when question is selected */}
                        {currentStandard?.is_weightage
                          && selectedQuestions[indicator.id]?.includes(question.id) && (
                          <input
                            type="number"
                            min={0}
                            className="form-control form-control-sm"
                            style={{ width: 100 }}
                            placeholder="Weightage"
                            value={questionWeightage[question.id] ?? ''}
                            onChange={(e) => {
                              const { value } = e.target;
                              setQuestionWeightage((prev) => ({
                                ...prev,
                                [question.id]:
                                  value === '' ? undefined : Number(value),
                              }));
                            }}
                          />
                        )}
                      </div>

                      {/* ✅ QUESTION OPTIONS — only when question is selected */}
                      {selectedQuestions[indicator.id]?.includes(question.id)
                        && ['SINGLE_SELECT', 'MULTI_SELECT'].includes(
                          question.question_type,
                        )
                        && question.question_options?.length > 0 && (
                          <div className="mt-3 ps-4">
                            <div className="fw-semibold mb-2 text-secondary">
                              Question Options
                            </div>

                            <ul className="list-unstyled mb-0">
                              {question.question_options
                                .filter((opt: any) => opt.is_deleted === false)
                                .map((option: any, optIndex: number) => (
                                  <li
                                    key={option.id}
                                    className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                                  >
                                    {/* LEFT – Option label */}
                                    <div className="d-flex align-items-center gap-2">
                                      {question.question_type
                                      === 'SINGLE_SELECT' ? (
                                        <input type="radio" disabled />
                                        ) : (
                                          <input type="checkbox" disabled />
                                        )}

                                      <span className="fw-medium">
                                        {option.text}
                                      </span>
                                    </div>

                                    {/* RIGHT – Weightage */}
                                    {currentStandard?.is_weightage && (
                                      <input
                                        type="number"
                                        min={0}
                                        className="form-control form-control-sm"
                                        style={{ width: 110 }}
                                        placeholder="Weightage"
                                        value={
                                          optionWeightage?.[option.id] ?? ''
                                        }
                                        onChange={(e) => {
                                          const { value } = e.target;
                                          setOptionWeightage((prev: any) => ({
                                            ...prev,
                                            [option.id]:
                                              value === ''
                                                ? undefined
                                                : Number(value),
                                          }));
                                        }}
                                      />
                                    )}
                                  </li>
                                ))}
                            </ul>
                          </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.45)', zIndex: 9999 }}
          role="button"
          tabIndex={0}
          onClick={() => !isDeleting && setDeleteTarget(null)}
          onKeyDown={(e) => { if (e.key === 'Escape' && !isDeleting) setDeleteTarget(null); }}
        >
          <div
            className="bg-white rounded-3 shadow-lg p-4"
            style={{ maxWidth: 450, width: '90%', minHeight: '240px' }}
            role="dialog"
            aria-modal="true"
          >
            {/* Icon + Title */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: 44, height: 44, background: '#F2F2F2' }}
              >
                <BsTrash size={20} color="#305B61" />
              </div>
              <div>
                <div className="fw-bold fs-6 bg-white" style={{ color: '#305B61' }}>
                  Delete Theme
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  This action cannot be undone
                </div>
              </div>
            </div>

            {/* Message */}
            <div
              className="rounded-2 px-3 py-2 mb-4"
              style={{
                background: '#EBF5F7',
                border: '1px solid #305B61',
                fontSize: 14,
              }}
            >
              Are you sure you want to delete the theme
              {' '}
              <strong>
                &quot;
                {deleteTarget.name}
                &quot;
              </strong>
              ? All linked indicators
              and questions will also be removed.
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-4 py-2"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm px-4 d-flex align-items-center gap-2 py-2"
                style={{ background: '#305B61', color: '#fff' }}
                onClick={executeDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <BsTrash size={13} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="action-buttonss">
        <Stack direction="horizontal" className="justify-content-end">
          <Button
            className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="my-4 py-2 btn-sm px-sm-4 savebtn me-3"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            className="my-4 py-2 btn-sm px-sm-4 savebtn me-3"
            disabled={!hasThemes}
            onClick={() => router.push(
              `/masters/standards/${currentStandard?.id}/link_questions`,
            )}
          >
            Next & Preview
          </Button>
        </Stack>
      </div>
    </div>
  );
}
