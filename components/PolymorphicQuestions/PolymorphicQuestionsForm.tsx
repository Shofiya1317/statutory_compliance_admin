'use client';

import {
  IQuestion,
  IQuestionOption,
} from '@/lib/interface/IQuestions.interface';
import { Field, FieldProps, Formik } from 'formik';
import { useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import { MdDelete, MdPlaylistAdd } from 'react-icons/md';
import {
  array, object, string, ValidationError,
} from 'yup';
import Button from '../Button/Button';
import { CustomInputField } from '../InputField/CustomInputField';
import DependentQuestionList from '../MasterList/DependentQuestionList/DependentQuestionList';
import IndicatorsSelect from '../MasterList/Indicators/IndicatorsSelect';
import QuestionsSelect from '../MasterList/Question/QuestionsSelect';
import { Option } from '../types';

export default function PolymorphicQuestionsForm() {
  const [optionIds, setOptionIds] = useState<string[] | undefined>();
  const [dependentQuestion, setDependentQuestion] = useState<
    IQuestion[] | undefined
  >();
  const initialQuestion = {
    question: {
      label: '',
      value: '',
    },
    question_option: [],
  };

  const initialValues = {
    indicator: {
      label: '',
      value: '',
    },
    questions: [initialQuestion, initialQuestion],
  };

  const validationSchema = object().shape({
    indicator: object({
      label: string().required('Indicator is required'),
      value: string().required('Indicator is required'),
    }).required('Indicator is required'),

    questions: array().when('indicator.value', {
      is: (value: string) => !!value,
      then: (schema) => schema
        .min(
          2,
          'At least two questions are required when indicator is selected',
        )
        .of(
          object().shape({
            question: object()
              .shape({
                label: string().required('Question label is required'),
                value: string().required('Question value is required'),
              })
              .required('Question object is required'),

            question_option: array()
              .of(
                object().shape({
                  id: string().required('Option ID is required'),
                  createdAt: string().required('Creation date is required'),
                  updatedAt: string().required('Update date is required'),
                  text: string().required('Text is required'),
                  value: string().required('Value is required'),
                }),
              )
              .notRequired(),
          }),
        )
        // eslint-disable-next-line func-names
        .test('unique-question-values', function (questions) {
          if (!questions || questions.length === 0) return true;
          const questionValues = questions
            .map((q) => q.question?.value?.trim())
            .filter(Boolean);
          const duplicateIndices: number[] = [];
          questionValues.forEach((value, index) => {
            if (
              questionValues.indexOf(value) !== index
              && !duplicateIndices.includes(index)
            ) {
              duplicateIndices.push(index);
            }
          });
          if (duplicateIndices.length > 0) {
            // eslint-disable-next-line react/no-this-in-sfc
            const errors = duplicateIndices.map((index) => this.createError({
              path: `questions.${index}.question.value`,
              message: 'Each question value must be unique',
            }));
            throw new ValidationError(errors);
          }
          return true;
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any, { setSubmitting, validateForm }: any) => {
    validateForm(values);

    setSubmitting(false);
  };

  const generateCombinations = (
    arrays: IQuestionOption[][],
    prefix: { id: string; text: string }[] = [],
  ): { id: string; text: string }[][] => {
    if (!arrays.length) return [prefix];

    const [firstArray, ...rest] = arrays;
    return firstArray.flatMap((item) => generateCombinations(rest, [
      ...prefix,
      { id: item?.id ?? '', text: item.text },
    ]));
  };

  return (
    <div>
      <h3>Polymorphic Questions Form</h3>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        {({
          errors,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          values,
          resetForm,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col className="mt-3">
                <Field name="indicator">
                  {({ field: formikField }: FieldProps<string>) => (
                    <CustomInputField
                      validationSchema={validationSchema}
                      label="Indicator"
                      field={formikField}
                      error={errors.indicator?.value as string}
                      isCustomRequired
                    >
                      <Field
                        name="indicator"
                        component={IndicatorsSelect}
                        id={formikField.name}
                        value={values?.indicator}
                        onChange={(e: Option) => {
                          setFieldValue('indicator', e);
                        }}
                      />
                    </CustomInputField>
                  )}
                </Field>
              </Col>
            </Row>
            {values?.indicator?.value && (
              <div>
                <Stack className="align-items-end mt-5">
                  <Button
                    className=" Cancelbtn"
                    disabled={values?.questions?.length >= 6}
                    onClick={() => {
                      setFieldValue('questions', [
                        ...(values?.questions || []),
                        initialQuestion,
                      ]);
                    }}
                  >
                    Add Question
                  </Button>
                </Stack>
                <Row className="mb-3">
                  {values?.questions?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const filedError: any = errors?.questions?.[index];
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Col md={6} className="mt-3">
                        <Row>
                          <Col md={10}>
                            <Field name={`question[${index}][question]`}>
                              {({ field: _field }: FieldProps<string>) => (
                                <CustomInputField
                                  validationSchema={validationSchema}
                                  label={`Question ${index + 1}`}
                                  error={filedError?.question?.value as string}
                                  field={_field}
                                >
                                  <Field
                                    component={QuestionsSelect}
                                    value={field?.question}
                                    onChange={(e: Option) => {
                                      setFieldValue(
                                        `questions[${index}][question]`,
                                        e,
                                      );
                                      setFieldValue(
                                        `questions[${index}][question_option]`,
                                        e?.data?.question_options,
                                      );
                                    }}
                                    indicator={
                                      (values?.indicator as unknown as Option)
                                        ?.value
                                    }
                                  />
                                </CustomInputField>
                              )}
                            </Field>
                          </Col>
                          <Col md={2} className="mt-3 p-0">
                            {index > 1 && (
                              <Button
                                type="button"
                                className="Cancelbtn mt-3"
                                onClick={() => {
                                  values?.questions?.splice(index, 1);
                                  setFieldValue('questions', values?.questions);
                                }}
                              >
                                <MdDelete />
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {values?.questions?.map((item) => item?.question_option)?.flat()
                ?.length > 1
                && generateCombinations(
                  values?.questions?.map((item) => item?.question_option),
                )?.length > 0
                && generateCombinations(
                  values?.questions?.map((item) => item?.question_option),
                )?.map((combo) => (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                    }}
                  >
                    <span>
                      {combo?.map((option) => option?.text || '').join(' x ')}
                    </span>
                    <MdPlaylistAdd
                      size={18}
                      color="black"
                      onClick={() => {
                        setOptionIds(combo?.map((option) => option?.id || ''));
                      }}
                    />
                  </div>
                ))}
            </div>
            <Stack direction="horizontal" className="justify-content-end ">
              <Button
                className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="my-4 py-2 btn-sm px-sm-4 savebtn"
                disabled={isSubmitting && !isValid}
              >
                Update
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
      <DependentQuestionList
        optionId={optionIds}
        setOptionId={setOptionIds}
        dependentQuestion={dependentQuestion}
        setDependentQuestion={setDependentQuestion}
      />
    </div>
  );
}
