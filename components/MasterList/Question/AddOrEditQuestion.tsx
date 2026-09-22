/* eslint-disable func-names */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

'use client';

import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { QUESTION_TYPES } from '@/lib/config/root_menu';
import {
  IQuestion,
  IQuestionOption,
} from '@/lib/interface/IQuestions.interface';
import { QuestionService } from '@/lib/service';
import { btnName, convertToPascalCase, Params } from '@/lib/utils';
import {
 Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import {
 array, object, string, ValidationError,
} from 'yup';
import IndicatorsSelect from '../Indicators/IndicatorsSelect';
// import ModulesSelect from '../Modules/ModulesSelect';
// import SubIndicatorsSelect from '../SubIndicators/SubIndicatorsSelect';
import MixedQuestionType from './MixedQuestionType';
import QuestionOptionsList from './QuestionOptionsList';
// import DepartmentSelect from '../Department/DepartmentSelect';

export interface IMixedProps {
  value_question_type: string;
  value_name: string;
  value_enum: { value: string }[];
  unit_type: string;
  unit_name: string;
  unit_enum: { value: string }[];
}
export interface QuestionProps {
  id: string;
  universal_question_id: string;
  indicator_id: {
    label: string;
    value: string;
  };
  title: string;
  description: string;
  question_type:
    | 'TEXT'
    | 'MULTI_SELECT'
    | 'SINGLE_SELECT'
    | 'NUMBER'
    | 'DATE'
    | 'FILE'
    | 'URL'
    | 'MIXED_TYPE';
  place_holder: string;
  options: IQuestionOption[];
  mixed_type_question: IMixedProps;
}

export default function AddOrEditQuestion({
  actionType,
  onClose,
  currentQuestion,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentQuestion?: IQuestion | undefined | any;
}) {
  const router = useRouter();
  const initialOption = { value: '', text: '', is_deleted: false };
  const initialMixedFields = {
    value_question_type: 'NUMBER',
    value_name: '',
    value_enum: [{ value: '' }, { value: '' }],
    unit_name: '',
    unit_type: 'SINGLE_SELECT',
    unit_enum: [{ value: '' }, { value: '' }],
  };
  const initialValues = {
    id: currentQuestion?.id || '',
    universal_question_id: currentQuestion?.universal_question_id || '',
    title: currentQuestion?.title || '',
    description: currentQuestion?.description || '',
    question_type: (currentQuestion?.question_type
      || 'TEXT') as QuestionProps['question_type'],
    options:
      currentQuestion?.question_options?.map((item: any) => ({
        id: item.id, // Make sure to preserve the id
        text: item.text,
        value: item.value,
        sequence_no: item.sequence_no,
        is_deleted: item.is_deleted || false,
      })) || [],
    indicator_id: {
      label: currentQuestion?.indicator?.name ?? '',
      value: currentQuestion?.indicator?.id ?? '',
    },
    place_holder: currentQuestion?.placeholder || '',
    mixed_type_question: currentQuestion?.mixed_type_questions[0]
      ? {
          ...currentQuestion.mixed_type_questions[0],
          value_enum: (
            currentQuestion.mixed_type_questions[0].value_enum || []
          ).map((item: any) => (typeof item === 'string' ? { value: item } : item)),
          unit_enum: (
            currentQuestion.mixed_type_questions[0].unit_enum || []
          ).map((item: any) => (typeof item === 'string' ? { value: item } : item)),
        }
      : initialMixedFields,
  };

  const isOptionable = (questionType: string) => ['SINGLE_SELECT', 'MULTI_SELECT'].includes(questionType);

  const validationSchema = object({
    indicator_id: object({
      label: string(),
      value: string().required('Indicator is required'),
    }).required('Indicator is required'),
    // universal_question_id: number()
    //   .transform((value, originalValue) => (originalValue === '' || originalValue === null ? undefined : value))
    //   .typeError('Universal Question ID must be a number')
    //   .required('Universal Question ID is required')
    //   .test('not-zero', 'Zero is not allowed', (value) => value !== 0)
    //   .test(
    //     'not-negative',
    //     'Negative numbers are not allowed',
    //     (value) => value > 0,
    //   ),
    universal_question_id: string()
      .trim()
      .required('Universal Question ID is required'),
    title: string().trim().required('Question Title is required'),
    question_type: string().trim().required('Question Type is required'),
    place_holder: string().trim(),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .min(3, 'Description must be between 3 and 5000 characters')
      .notRequired(),
    mixed_type_question: object().when('question_type', {
      is: 'MIXED_TYPE',
      then: (schema) => schema.shape({
          value_question_type: string().required(
            'Value question type is required',
          ),
          value_name: string().trim().required('Value name is required'),
          value_enum: array().when('value_question_type', {
            is: (type: string) => isOptionable(type),
            then: (schema) => schema
                .min(
                  2,
                  'At least one option is required for SINGLE or MULTIPLE',
                )
                .of(
                  object().shape({
                    value: string()
                      .trim()
                      .min(2, 'At least min 2 charaters')
                      .required('Option is required'),
                  }),
                )
                .test('unique-unit-enum-text', function (options) {
                  if (!options) return true;
                  const texts = options.map((o) => o.value?.trim().toLowerCase());
                  const duplicates = texts.filter(
                    (t, i, arr) => arr.indexOf(t) !== i,
                  );
                  if (duplicates.length > 0) {
                    const errors = options
                      .map((opt, index) => {
                        const text = opt.value?.trim().toLowerCase();
                        if (text && duplicates.includes(text)) {
                          return this.createError({
                            path: `${this.path}.${index}.value`,
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
            otherwise: (schema) => schema.notRequired(),
          }),
          unit_type: string().required('Unit type is required'),
          unit_name: string().trim().required('Unit name is required'),
          unit_enum: Yup.array().when('unit_type', {
            is: (type: string) => isOptionable(type),
            then: (schema) => schema
                .min(
                  2,
                  'At least one option is required for SINGLE or MULTIPLE',
                )
                .of(
                  object().shape({
                    value: string().trim().required('Option is required'),
                  }),
                )
                .test('unique-unit-enum-text', function (options) {
                  if (!options) return true;
                  const texts = options.map((o) => o.value?.trim().toLowerCase());
                  const duplicates = texts.filter(
                    (t, i, arr) => arr.indexOf(t) !== i,
                  );
                  if (duplicates.length > 0) {
                    const errors = options
                      .map((opt, index) => {
                        const text = opt.value?.trim().toLowerCase();
                        if (text && duplicates.includes(text)) {
                          return this.createError({
                            path: `${this.path}.${index}.value`,
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
            otherwise: (schema) => schema.notRequired(),
          }),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
    options: array().when('question_type', {
      is: (type: string) => isOptionable(type),
      then: (schema) => schema
          .min(2, 'At least one option is required for SINGLE or MULTIPLE')
          .of(
            object().shape({
              text: string().trim().required('Text is required'),
              value: string().trim().notRequired(),
            }),
          )
          .test('unique-question-options-text', function (options) {
            if (!options) return true;
            const texts = options.map((o) => o.text?.trim().toLowerCase());
            const duplicates = texts.filter(
              (t, i, arr) => arr.indexOf(t) !== i,
            );
            if (duplicates.length > 0) {
              const errors = options
                .map((opt, index) => {
                  const text = opt.text?.trim().toLowerCase();
                  if (text && duplicates.includes(text)) {
                    return this.createError({
                      path: `options.${index}.text`,
                      message: 'Option texts must be unique',
                    });
                  }
                  return null;
                })
                .filter(Boolean);

              throw new ValidationError(errors as ValidationError[]);
            }
            return true;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Question!';
      case 'Edit':
        return 'Updated Question!';
      default:
        return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastAndCloseModal = (res: any) => {
    const { success, error } = res?.data as {
      success: boolean;
      error: string[];
    };
    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const reorderWithSequence = <T extends { is_deleted: boolean }>(
    items: T[],
  ): (T & { sequence_no: number })[] => {
    const nonDeleted = items.filter((item) => !item.is_deleted);
    const deleted = items.filter((item) => item.is_deleted);
    const reordered = [...nonDeleted, ...deleted];
    return reordered.map((item, index) => ({
      ...item,
      sequence_no: index + 1,
    }));
  };

  const onSubmit = async (
    values: QuestionProps,
    { validateForm }: FormikHelpers<QuestionProps>,
  ) => {
    validateForm(values);
    const mixedTypeParams: any = {
      ...values.mixed_type_question,
      value_enum: values?.mixed_type_question?.value_enum?.map(
        (item) => item?.value,
      ),
      unit_enum: values?.mixed_type_question?.unit_enum?.map(
        (item) => item?.value,
      ),
    };
    if (!isOptionable(mixedTypeParams?.unit_type)) {
      delete mixedTypeParams?.unit_enum;
    }
    if (!isOptionable(mixedTypeParams?.value_question_type)) {
      delete mixedTypeParams?.value_enum;
    }
    const questionParams: Record<string, any> = {
      indicator_id: values.indicator_id?.value,
      title: values.title?.trim(),
      description: values.description?.trim(),
      question_type: values.question_type,
      id: values.id,
      universal_question_id: values.universal_question_id,
      place_holder: values.place_holder,
      mixed_type_question:
        values?.question_type !== 'MIXED_TYPE' ? {} : mixedTypeParams,
     options: !isOptionable(values?.question_type)
  ? []
  : reorderWithSequence(values.options).map((opt: any) => ({
      id: opt.id,
      text: opt.text,
      value: opt.value,
      sequence_no: opt.sequence_no,
      is_deleted: opt.is_deleted || false,
    })),
    };

    let res;
    switch (actionType) {
      case 'Create':
        res = await QuestionService.create(questionParams as unknown as Params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await QuestionService.update(
          questionParams as unknown as Params,
          questionParams?.id || '',
        );
        toastAndCloseModal(res);
        return;
      default:
        // eslint-disable-next-line consistent-return
        return null;
    }
  };

  const rearrangeOptionQuestions = (
    fromActualIndex: number,
    toActualIndex: number,
    options: IQuestionOption[] | undefined,
    updateKey: string,
    setFieldValue: any,
  ) => {
    if (!options) return;

    // Create a new array
    const newArray = [...options];

    // Swap the items
    const temp = newArray[fromActualIndex];
    newArray[fromActualIndex] = newArray[toActualIndex];
    newArray[toActualIndex] = temp;

    setFieldValue(updateKey, newArray);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        {({
 errors, handleSubmit, isSubmitting, values, setFieldValue,
}) => (
  <form onSubmit={handleSubmit}>
    <div style={{ background: '#fefefe' }} className="p-4 pt-0">
      <Row>
        <Col className="mt-3">
          <Field name="indicator_id">
            {({ field }: FieldProps<string>) => (
              <CustomInputField
                validationSchema={validationSchema}
                label="Indicator"
                error={errors.indicator_id?.value as string}
                field={field}
                isCustomRequired
              >
                <Field
                  component={IndicatorsSelect}
                  name={field.name}
                  isMulti={false}
                  value={values?.indicator_id}
                  onChange={(e: Option) => setFieldValue(field.name, e)}
                />
              </CustomInputField>
                    )}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col className="mt-3" style={{ zIndex: 0 }}>
          <FormikField
            name="universal_question_id"
            type="text"
            validationSchema={validationSchema}
            label="Universal Question ID"
            errors={errors as Record<string, string>}
            placeholder="Enter Universal Question ID"
            maxLength={600}
            isCustomRequired
            disabled={actionType === 'Edit'}
          />
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <Field name="question_type">
            {({ field }: FieldProps<string>) => (
              <CustomInputField
                validationSchema={validationSchema}
                label="Question type"
                error={errors.question_type as string}
                field={field}
              >
                <Field
                  component={CustomSelect}
                  options={QUESTION_TYPES.map((type) => ({
                            value: type,
                            label: convertToPascalCase(
                              type?.replace('_SELECT', ' ')?.replace('_', ' '),
                            ),
                          }))}
                  name={field.name}
                  onFieldUpdate={(e: Option) => {
                            setFieldValue('question_type', e?.value);
                            if (e?.value === 'MIXED_TYPE') {
                              setFieldValue('options', []);
                            }
                            if (isOptionable(e?.value)) {
                              setFieldValue(
                                'mixed_type_questions',
                                initialMixedFields,
                              );
                              setFieldValue('options', [
                                initialOption,
                                initialOption,
                              ]);
                            }
                          }}
                />
              </CustomInputField>
                    )}
          </Field>
        </Col>
      </Row>
      {/* <Row>
                <Col className="mt-3">
                  <label>Is Upload *</label>
                  <div className="d-flex">
                    <div
                      className="form-check form-switch me-4"
                      id="toogle-switch"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={values?.is_upload}
                        onChange={(e) => {
                          setFieldValue('is_upload', e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row> */}
      <Row>
        <Col className="mt-3" style={{ zIndex: 0 }}>
          <FormikField
            name="place_holder"
            type="text"
            validationSchema={validationSchema}
            label="Placeholder"
            errors={errors as Record<string, string>}
            placeholder="Placeholder"
            maxLength={250}
          />
        </Col>
      </Row>
      <Row>
        <Col className="mt-3" style={{ zIndex: 0 }}>
          <FormikField
            name="title"
            type="text"
            validationSchema={validationSchema}
            label="Title"
            errors={errors as Record<string, string>}
            placeholder="Title"
            maxLength={600}
          />
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <FormikField
            as="textarea"
            name="description"
            type="text"
            validationSchema={validationSchema}
            label="Description"
            errors={errors as Record<string, string>}
            autoFocus
            placeholder="Enter your Description"
          />
        </Col>
      </Row>
      {isOptionable(values.question_type) && (
      <QuestionOptionsList
        actionType={actionType}
        questionId={values?.id}
        namePrefix="options"
        options={values?.options ?? []}
        errors={errors}
        fieldError={errors?.options}
        validationSchema={validationSchema}
        onAddOption={() => setFieldValue('options', [
                      ...(values?.options ?? []),
                      initialOption,
                    ])}
        onReorder={(from, to) => {
                    rearrangeOptionQuestions(
                      from,
                      to,
                      values?.options,
                      'options',
                      setFieldValue,
                    );
                  }}
        setFieldValue={setFieldValue}
      />
              )}
      {values?.question_type === 'MIXED_TYPE' && (
      <MixedQuestionType
        values={values}
        validationSchema={validationSchema}
        setFieldValue={setFieldValue}
        errors={errors}
        isOptionable={isOptionable}
      />
              )}
      <div className="d-flex justify-content-end pt-5">
        <Button
          className="btn  Cancelbtn"
          onClick={() => {
                    onClose?.();
                  }}
        >
          Cancel
        </Button>
        <Button type="submit" className="savebtn ms-3">
          {btnName(isSubmitting, actionType)}
        </Button>
      </div>
    </div>
  </form>
        )}
      </Formik>
    </div>
  );
}
