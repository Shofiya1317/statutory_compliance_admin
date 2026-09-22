/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable camelcase */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import Button from '@/components/Button/Button';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ToggleSwitch } from '@/components/ToggleSwitch/ToggleSwitch';
import { Option } from '@/components/types';
import {
  IQuestionSequences,
  IStandard,
} from '@/lib/interface/IStandard.interface';
import { StandardService } from '@/lib/service';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
import {
  array, boolean, object, string, ValidationError,
} from 'yup';

export interface Rule {
  parent_question_id: string;
  parent_question_option_id: string;
  is_deleted: boolean;
}

export interface linkQuestionProps {
  theme: string;
  indicator: string;
  question_sequence_id: string;
  rules: Rule[];
  question_type: 'STANDARD' | 'GROUP';
}

interface QuestionRulesParams {
  indicator_id: string;
  question_id: string;
  rules: {
    id: string;
    parent_question_id: string;
    parent_question_option_id: string;
    parent_question_option_ids: string[];
    value: string;
    is_removed: boolean;
    sequence: number;
  }[];
}

export default function LinkQuestions({
  onClose,
  onSuccess,
  currentStandard,
  currentQuestion,
  token,
}: {
  onClose: () => void;
  onSuccess?: () => void;
  currentStandard: IStandard;
  currentQuestion?: {
    themeId: string;
    indicatorId: string;
    indicatorName: string;
    question?: IQuestionSequences;
    questionType: 'STANDARD';
  };
  token?: string;
}) {
  // console.log(currentQuestion, '----');
  const router = useRouter();
  const [standardIndicators, setStandardIndicators] = useState<any[]>(
    currentQuestion?.indicatorId && currentQuestion?.indicatorName
      ? [
        {
          label: currentQuestion.indicatorName,
          value: currentQuestion.indicatorId,
        },
      ]
      : [],
  );
  const [standardQuestions, setStandardQuestions] = useState<any[]>([]);

  const initialRuleValue = {
    parent_question_id: '',
    parent_question_option_id: '',
    is_deleted: false,
  };

  const initialValues: linkQuestionProps = {
    question_sequence_id: '',
    theme: currentQuestion?.themeId || '',
    indicator: currentQuestion?.indicatorId || '',
    question_type: 'STANDARD',
    rules: [
      {
        parent_question_id: '',
        parent_question_option_id: '',
        is_deleted: false,
      },
    ],
  };

  const ruleSchema = object({
    is_deleted: boolean(),
    parent_question_id: string().when('is_deleted', {
      is: ((val: boolean) => val === false) as (val: any) => boolean,
      then: (schema) => schema.required('Question Id is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    parent_question_option_id: string().when('is_deleted', {
      is: ((val: boolean) => val === false) as (val: any) => boolean,
      then: (schema) => schema.required('Question Options is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }).noUnknown();

  const validationSchema = object({
    question_sequence_id: string().required('Question is required'),
    indicator: string().required('Indicator is required'),
    theme: string().required('Module is required'),
    rules: array()
      .min(1, 'At least one rule is required')
      .of(ruleSchema)
      .test('min-items-based-on-form-type', function (values) {
        const texts = values?.map((o) => o?.parent_question_id);
        if (!texts) {
          return this.createError({
            path: 'rules[0].parent_question_id',
            message: 'At least 1 rule is required',
          });
        }
        return true;
      })
      .test('unique-question-option', function (options) {
        if (!options) return true;

        const activeItems = options.filter(
          (o) => !o?.is_deleted && o?.parent_question_option_id,
        );

        const optionIds = activeItems.map((o) => o.parent_question_option_id);
        const duplicates = optionIds.filter(
          (id, index, arr) => arr.indexOf(id) !== index,
        );

        if (duplicates.length > 0) {
          const errors = activeItems
            .map((opt, index) => {
              if (
                opt.parent_question_option_id
                && duplicates.includes(opt.parent_question_option_id)
              ) {
                return this.createError({
                  path: `rules[${index}].parent_question_option_id`,
                  message: 'Option must be unique',
                });
              }
              return null;
            })
            .filter(Boolean);

          throw new ValidationError(errors as ValidationError[]);
        }

        return true;
      }),
  });

  const onSubmit = async (
    values: linkQuestionProps,
    { validateForm, setSubmitting }: FormikHelpers<linkQuestionProps>,
  ) => {
    validateForm(values);

    try {
      setSubmitting(true);
      const payload = {
        indicator_id: values.indicator,
        question_id: values.question_sequence_id,
        rules: values.rules
          .filter((item) => !item.is_deleted)
          .map((item, index) => ({
            id: '',
            parent_question_id: item.parent_question_id,
            parent_question_option_id: item.parent_question_option_id,
            parent_question_option_ids: [],
            value: '', // default empty, update if you have a value field
            is_removed: item.is_deleted,
            sequence: index + 1,
          })),
      };

      // console.log(payload, 'payload');

      const res = await StandardService.addQuestionRules(
        currentStandard?.id || '',
        payload,
      );

      const { success, error } = res?.data as {
        success: boolean;
        error: string[];
      };

      if (success) {
        toast.success('Added the rules');
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(error[0]);
      }
    } catch (err) {
      // console.error(err);
      toast.error('Failed to add rules');
    } finally {
      setSubmitting(false);
    }
  };

  const themes = () => currentStandard?.standard_themes;

  const getQuestionsByIndicator = async (indicatorId: string) => {
    try {
      const questionsRes = await StandardService.getQuestionsByStandardIndicator(
        currentStandard.id,
        indicatorId,
      );

      const questions = questionsRes?.data?.questions ?? [];

      if (questions.length === 0) {
        setStandardQuestions([]);
        return;
      }

      // Fetch all question details in parallel instead of using a loop
      const questionDetailsPromises = questions.map(async (question: any) => {
        try {
          const questionDetailsRes = await StandardService.getQuestionById(
            question.id,
            token,
          );
          return {
            question,
            isDependent: questionDetailsRes?.data?.is_dependent ?? false,
            success: true,
          };
        } catch (error) {
          console.error(
            `Failed to fetch question details for ID: ${question.id}`,
            error,
          );
          return {
            question,
            isDependent: false, // Include question if API fails to prevent blocking
            success: false,
          };
        }
      });

      const results = await Promise.all(questionDetailsPromises);

      // Filter out dependent questions
      const independentQuestions = results
        .filter((result) => !result.isDependent)
        .map((result) => result.question);

      setStandardQuestions(independentQuestions);

      // Optional: Show feedback if questions were filtered out
      if (independentQuestions.length !== questions.length) {
        const filteredCount = questions.length - independentQuestions.length;
      }
    } catch (error) {
      console.error('Failed to fetch questions by indicator', error);
      setStandardQuestions([]);
      toast.error('Failed to load questions');
    }
  };

  useEffect(() => {
    if (currentQuestion?.indicatorId) {
      getQuestionsByIndicator(currentQuestion?.indicatorId);
    }
  }, [currentQuestion?.indicatorId]);

  const filterRule = (rules: Rule[]) => rules?.filter((item) => !item?.is_deleted);
  // eslint-disable-next-line max-len
  const findQuestionById = (questionId: string) => standardQuestions.find((q: any) => q.id === questionId);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
      enableReinitialize
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        values,
        setFieldValue,
        setValues,
      }) => (
        <>
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

          <form onSubmit={handleSubmit}>
            <div style={{ background: '#fefefe' }} className="p-4 pt-0">
              <Row>
                <Col className="mt-3" md={12}>
                  <Field name="theme">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Theme"
                        error={errors.theme as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          name={field.name}
                          options={themes()?.map((item) => ({
                            label: item?.name,
                            value: item?.id,
                          }))}
                          isMulti={false}
                          onFieldUpdate={(e: Option) => {
                            setValues({
                              ...initialValues,
                              [field.name]: e?.value,
                            });
                          }}
                          value={values?.theme}
                          isDisabled={currentQuestion}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
                <Col className="mt-3" md={12}>
                  <Field name="indicator">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Indicator"
                        error={errors.indicator as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          name={field.name}
                          options={standardIndicators?.map((item) => ({
                            label: item?.label,
                            value: item?.value,
                          }))}
                          isMulti={false}
                          value={values?.indicator}
                          // onFieldUpdate={(e: Option) => {
                          //   setValues({
                          //     ...initialValues,
                          //     theme: values?.theme,
                          //     [field.name]: e?.value,
                          //   });
                          // }}
                          isDisabled={!values?.theme || currentQuestion}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
                <Col md={6} className="mt-3">
                  <label>Question Type *</label>
                  <div className="mt-2">
                    <ToggleSwitch
                      textOff="Group"
                      textOn="Standard"
                      checked={values?.question_type === 'STANDARD'}
                      onChange={(e) => {
                        setFieldValue(
                          'question_type',
                          e?.target?.checked ? 'STANDARD' : 'GROUP',
                        );
                        setFieldValue('rules', [initialRuleValue]);
                      }}
                    />
                  </div>
                </Col>
                <Col className="mt-3" md={12}>
                  <Field name="question_sequence_id">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Questions"
                        error={errors.question_sequence_id as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          name={field.name}
                          options={standardQuestions.map((q: any) => ({
                            label: q.universal_question_id
                              ? `${q.title} (${q.universal_question_id})`
                              : q.title,
                            value: q.id,
                          }))}
                          isMulti={false}
                          value={
                            standardQuestions
                              .map((q: any) => ({
                                label: q.universal_question_id
                                  ? `${q.title} (${q.universal_question_id})`
                                  : q.title,
                                value: q.id,
                              }))
                              .find(
                                (opt) => opt.value === values.question_sequence_id,
                              ) || null
                          }
                          onFieldUpdate={(e: Option) => {
                            setFieldValue(field.name, e.value);
                          }}
                          isDisabled={!values.indicator}
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
                <div className="mt-3">
                  <label>Add Rule Questions</label>
                  {values?.rules?.map((item, index) => {
                    const rulesError: any = errors?.rules?.[index];
                    if (item?.is_deleted) return null;
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        className="p-3 my-3"
                        style={{
                          background: '#fefefe',
                          border: '1px solid #ccc',
                        }}
                      >
                        <Row>
                          <Col md={8} className="mt-3">
                            <Field name={`rules[${index}].parent_question_id`}>
                              {({ field }: FieldProps<string>) => (
                                <CustomInputField
                                  validationSchema={validationSchema}
                                  label="Parent Questions"
                                  error={rulesError?.parent_question_id}
                                  field={field}
                                  isCustomRequired
                                >
                                  <Field
                                    component={CustomSelect}
                                    name={field.name}
                                    isMulti={false}
                                    value={item.parent_question_id}
                                    options={standardQuestions
                                      .filter(
                                        (q: any) => [
                                          'SINGLE_SELECT',
                                          'MULTI_SELECT',
                                        ].includes(q.question_type)
                                          && q.id !== values.question_sequence_id,
                                      )
                                      .map((q: any) => ({
                                        label: q.universal_question_id
                                          ? `${q.title} (${q.universal_question_id})`
                                          : q.title,
                                        value: q.id,
                                      }))}
                                    // eslint-disable-next-line max-len
                                    onFieldUpdate={(e: Option) => setFieldValue(field.name, e.value)}
                                    isDisabled={!values.question_sequence_id}
                                  />
                                </CustomInputField>
                              )}
                            </Field>
                          </Col>
                          <Col
                            md={filterRule(values?.rules)?.length > 1 ? 3 : 4}
                            className="mt-3"
                          >
                            <Field
                              name={`rules[${index}].parent_question_option_id`}
                            >
                              {({ field }: FieldProps<string>) => (
                                <CustomInputField
                                  validationSchema={validationSchema}
                                  label="Choose Parent Option"
                                  error={rulesError?.parent_question_option_id}
                                  field={field}
                                  isCustomRequired
                                >
                                  <Field
                                    component={CustomSelect}
                                    name={field.name}
                                    isMulti={false}
                                    value={item.parent_question_option_id}
                                    options={
                                      findQuestionById(
                                        item.parent_question_id,
                                      )?.standard_question_options?.map(
                                        (opt: any) => ({
                                          label: opt.text,
                                          value: opt.id,
                                        }),
                                      ) || []
                                    }
                                    // eslint-disable-next-line max-len
                                    onFieldUpdate={(e: Option) => setFieldValue(field.name, e.value)}
                                    isDisabled={!item.parent_question_id}
                                  />
                                </CustomInputField>
                              )}
                            </Field>
                          </Col>
                          {filterRule(values?.rules)?.length > 1 && (
                            <Col md={1} className="mt-4">
                              <Button
                                type="button"
                                className="Cancelbtn mx-3 ms-2 mt-3"
                                onClick={() => {
                                  setFieldValue(
                                    `rules[${index}][is_deleted]`,
                                    true,
                                  );
                                }}
                              >
                                <MdDelete />
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </div>
                    );
                  })}
                  <Stack className="align-items-end mt-2">
                    <Button
                      className=" Cancelbtn"
                      onClick={() => {
                        setFieldValue('rules', [
                          ...values?.rules,
                          initialRuleValue,
                        ]);
                      }}
                      disabled={!values?.question_sequence_id}
                    >
                      Add Rules Questions
                    </Button>
                  </Stack>
                </div>
              </Row>
            </div>
            <div className="d-flex justify-content-between pt-5">
              <Button
                className="btn  Cancelbtn"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    router.push(
                      `/masters/standards/${currentStandard?.id}/link_questions`,
                    );
                  }
                }}
              >
                Back
              </Button>
              <Button type="submit" className="savebtn">
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
}
