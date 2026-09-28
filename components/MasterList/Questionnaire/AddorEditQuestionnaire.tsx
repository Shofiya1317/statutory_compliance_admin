/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikField } from '@/components/FormikField/FormikField';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { QUESTION_TYPES } from '@/lib/config/root_menu';
import { IQuestionnaire } from '@/lib/interface/IQuestionnaire.interface';
import { QuestionnaireService } from '@/lib/service';
import { btnName, convertToPascalCase } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import {
  Button, Col, Row, Stack,
} from 'react-bootstrap';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import { array, object, string } from 'yup';

interface IOptionItem {
  id?: string;
  text: string;
}

interface IFields {
  universal_question_id: string;
  title: string;
  description: string;
  type: string;
  options: IOptionItem[];
  placeholder: string;
  compliance_scope: string;
  id?: string;
}

const complianceScopeOptions: Option[] = [
  {
    label: 'Air Quality Testing Protocol',
    value: 'Air Quality Testing Protocol',
  },
  {
    label: 'Hazardous Chemical Disposal Procedure',
    value: 'Hazardous Chemical Disposal Procedure',
  },
  {
    label: 'Factory Safety Audit Scope',
    value: 'Factory Safety Audit Scope',
  },
  {
    label: 'Notice Board & Working Hours Audit',
    value: 'Notice Board & Working Hours Audit',
  },
];

const questionTypeOptions: Option[] = QUESTION_TYPES.map((type) => ({
  label: convertToPascalCase(type.replace('_SELECT', ' ').replace('_', ' ')),
  value: type,
}));

const isOptionable = (type: string) => ['SINGLE_SELECT', 'MULTI_SELECT'].includes(type);

export default function AddorEditQuestionnaire({
  actionType,
  onClose,
  currentQuestionnaire,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentQuestionnaire?: IQuestionnaire | undefined;
}) {
  const router = useRouter();
  const initialOption: IOptionItem = { text: '' };

  const parsedOptions: IOptionItem[] = (currentQuestionnaire?.options && Array.isArray(currentQuestionnaire.options))
    ? currentQuestionnaire.options.map((opt: any) => (typeof opt === 'string' ? { text: opt } : { text: opt.text || '' }))
    : [{ text: '' }, { text: '' }];

  const initialValues: IFields = {
    universal_question_id: currentQuestionnaire?.universal_question_id ?? '',
    title: currentQuestionnaire?.title ?? '',
    description: currentQuestionnaire?.description ?? '',
    type: currentQuestionnaire?.type ?? 'TEXT',
    options: parsedOptions.length > 0 ? parsedOptions : [{ text: '' }, { text: '' }],
    placeholder: currentQuestionnaire?.placeholder ?? '',
    compliance_scope: currentQuestionnaire?.compliance_scope ?? '',
    id: currentQuestionnaire?.id ?? '',
  };

  const validationSchema = object({
    universal_question_id: string()
      .trim()
      .max(600, 'Universal Question ID must be up to 600 characters')
      .required('Universal Question ID is required'),
    title: string()
      .max(500, 'Title must be between 3 and 500 characters')
      .min(3, 'Title must be between 3 and 500 characters')
      .required('Question Title is required'),
    type: string().required('Question Type is required'),
    compliance_scope: string().notRequired(),
    placeholder: string().max(250, 'Placeholder must be up to 250 characters').notRequired(),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .notRequired(),
    options: array().when('type', {
      is: (t: string) => isOptionable(t),
      then: (schema) => schema
        .min(2, 'At least 2 options are required for select question types')
        .of(
          object().shape({
            text: string().trim().required('Option text is required'),
          }),
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Questionnaire!';
      case 'Edit':
        return 'Updated Questionnaire!';
      default:
        return '';
    }
  };

  const toastAndCloseModal = (res: any) => {
    const { success, error } = (res?.data || {}) as {
      success: boolean;
      error?: string[];
    };
    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const onSubmit = async (
    values: IFields,
    { validateForm }: FormikHelpers<IFields>,
  ) => {
    await validateForm(values);
    let res;
    const optionsArray = isOptionable(values.type)
      ? values.options.map((opt) => opt.text.trim()).filter(Boolean)
      : [];

    const params = {
      universal_question_id: values.universal_question_id,
      title: values.title,
      description: values.description,
      type: values.type,
      options: optionsArray,
      placeholder: values.placeholder,
      compliance_scope: values.compliance_scope,
    };

    switch (actionType) {
      case 'Create':
        res = await QuestionnaireService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await QuestionnaireService.update(
          params,
          values?.id || '',
        );
        toastAndCloseModal(res);
        return;
      default:
        return null;
    }
  };

  const rearrangeOptions = (
    fromIndex: number,
    toIndex: number,
    options: IOptionItem[],
    setFieldValue: any,
  ) => {
    if (!options || fromIndex < 0 || toIndex < 0 || toIndex >= options.length) return;
    const newOptions = [...options];
    const temp = newOptions[fromIndex];
    newOptions[fromIndex] = newOptions[toIndex];
    newOptions[toIndex] = temp;
    setFieldValue('options', newOptions);
  };

  const handleDeleteOption = (
    index: number,
    options: IOptionItem[],
    setFieldValue: any,
  ) => {
    const newOptions = options.filter((_, i) => i !== index);
    setFieldValue('options', newOptions);
  };

  return (
    <div>
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
        }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#fefefe' }} className="p-4 pt-0">
              {/* Question Title */}
              <Row>
                <Col className="mt-3" style={{ zIndex: 0 }}>
                  <FormikField
                    name="title"
                    type="text"
                    validationSchema={validationSchema}
                    label="Question Title"
                    errors={errors as Record<string, string>}
                    autoFocus
                    placeholder="Enter Question Title"
                    maxLength={600}
                    isCustomRequired
                  />
                </Col>
              </Row>

              {/* Universal Question ID */}
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

              {/* Question Type & Compliance Scope */}
              <Row>
                <Col className="mt-3" md={6}>
                  <Field name="type">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Question Type"
                        error={errors.type as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          options={questionTypeOptions}
                          name={field.name}
                          id={field.name}
                          onChange={(e: Option) => {
                            setFieldValue('type', e?.value || 'TEXT');
                            if (isOptionable(e?.value || '')) {
                              if (!values.options || values.options.length === 0) {
                                setFieldValue('options', [
                                  { text: '' },
                                  { text: '' },
                                ]);
                              }
                            }
                          }}
                          value={
                            questionTypeOptions.find(
                              (opt) => opt.value === values.type,
                            ) || { label: values.type, value: values.type }
                          }
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>

                <Col className="mt-3" md={6}>
                  <Field name="compliance_scope">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Compliance Scope"
                        error={errors.compliance_scope as string}
                        field={field}
                      >
                        <Field
                          component={CustomSelect}
                          options={complianceScopeOptions}
                          name={field.name}
                          id={field.name}
                          placeholder="Select Compliance Scope"
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || '');
                          }}
                          value={
                            complianceScopeOptions.find(
                              (opt) => opt.value === values.compliance_scope,
                            ) || (values.compliance_scope
                              ? { label: values.compliance_scope, value: values.compliance_scope }
                              : null)
                          }
                          isClearable
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>

              {/* Placeholder */}
              <Row>
                <Col className="mt-3" style={{ zIndex: 0 }}>
                  <FormikField
                    name="placeholder"
                    type="text"
                    validationSchema={validationSchema}
                    label="Placeholder"
                    errors={errors as Record<string, string>}
                    placeholder="Enter placeholder text..."
                    maxLength={250}
                  />
                </Col>
              </Row>

              {/* Description */}
              <Row>
                <Col className="mt-3">
                  <FormikField
                    as="textarea"
                    name="description"
                    type="text"
                    validationSchema={validationSchema}
                    label="Description"
                    errors={errors as Record<string, string>}
                    placeholder="Enter your Description"
                  />
                </Col>
              </Row>

              {/* Dynamic Options List in the rubicr_admin_frontend style */}
              {isOptionable(values.type) && (
                <Row className="my-3">
                  <Col md={12}>
                    <h6 className="fw-semibold text-dark mb-0">Question Options</h6>
                  </Col>

                  <Col md={12} className="p-3 rounded">
                    {values.options?.map((option: IOptionItem, index: number) => (
                      <div
                        key={index}
                        className="p-3 my-3 rounded"
                        style={{
                          background: '#fefefe',
                          border: '1px solid #ccc',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          {/* MOVE UP */}
                          {index !== 0 && (
                            <BsFillArrowUpCircleFill
                              className="cursor-pointer me-2 text-primary"
                              style={{ fontSize: '18px', cursor: 'pointer' }}
                              onClick={() => rearrangeOptions(
                                index,
                                index - 1,
                                values.options,
                                setFieldValue,
                              )}
                              title="Move Up"
                            />
                          )}

                          {/* MOVE DOWN */}
                          {index !== values.options.length - 1 && (
                            <BsFillArrowDownCircleFill
                              className="cursor-pointer me-2 text-primary"
                              style={{ fontSize: '18px', cursor: 'pointer' }}
                              onClick={() => rearrangeOptions(
                                index,
                                index + 1,
                                values.options,
                                setFieldValue,
                              )}
                              title="Move Down"
                            />
                          )}

                          <span className="fw-semibold text-muted small">
                            Option {index + 1}
                          </span>
                        </div>

                        <Stack
                          direction="horizontal"
                          className="align-items-start w-100"
                        >
                          <div className="w-100">
                            <FormikField
                              name={`options[${index}][text]`}
                              type="text"
                              validationSchema={validationSchema}
                              label={`Option Text ${index + 1}`}
                              errors={errors as Record<string, string>}
                              placeholder="Enter option text..."
                              isCustomRequired
                            />
                          </div>

                          {/* DELETE BUTTON */}
                          <div>
                            {values.options.length > 2 && (
                              <Button
                                type="button"
                                className="Cancelbtn mt-4 ms-3 d-flex align-items-center justify-content-center"
                                style={{ height: '38px', minWidth: '40px' }}
                                onClick={() => handleDeleteOption(
                                  index,
                                  values.options,
                                  setFieldValue,
                                )}
                                title="Delete Option"
                              >
                                <MdDelete style={{ fontSize: '18px', color: '#e53e3e' }} />
                              </Button>
                            )}
                          </div>
                        </Stack>
                      </div>
                    ))}

                    <Stack className="align-items-center mt-3">
                      <Button
                        type="button"
                        className="Cancelbtn px-4 py-2"
                        onClick={() => setFieldValue('options', [
                          ...(values.options || []),
                          initialOption,
                        ])}
                      >
                        + Add Option
                      </Button>
                    </Stack>
                  </Col>
                </Row>
              )}

              {/* Actions Footer */}
              <div className="d-flex justify-content-end pt-5">
                <Button
                  type="button"
                  className="btn Cancelbtn px-4 py-2"
                  onClick={() => {
                    onClose?.();
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="savebtn ms-3 px-4 py-2"
                  disabled={isSubmitting}
                >
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
