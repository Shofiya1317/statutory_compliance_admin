/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { Option } from '@/components/types';
import { QUESTION_TYPES } from '@/lib/config/root_menu';
import { convertToPascalCase } from '@/lib/utils';
import { Field, FieldProps } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { AnyObject, AnySchema } from 'yup';
import { IMixedProps, QuestionProps } from './AddOrEditQuestion';
import MixedTypeEnumList from './MixedTypeEnumList';

export default function MixedQuestionType({
  values,
  setFieldValue,
  errors,
  validationSchema,
  isOptionable,
}: {
  values: QuestionProps;
  setFieldValue: any;
  errors: any;
  validationSchema: AnySchema<AnyObject>;
  isOptionable: (data: string) => boolean;
}) {
  const mixedType: any = values?.mixed_type_question as IMixedProps;
  const filedError = errors?.mixed_type_question as IMixedProps;
  const initialOption = { value: '' };
  return (
    <div
      className="p-3 my-3"
      style={{ background: '#fefefe', border: '1px solid #ccc' }}
    >
      <Row>
        <Col md={6} className="mt-3">
          <FormikField
            name="mixed_type_question[value_name]"
            type="text"
            validationSchema={validationSchema}
            label="Placeholder"
            errors={errors as Record<string, string>}
            placeholder="Placeholder"
            isCustomRequired
            maxLength={2000}
            customErrorMap={filedError?.value_name as string}
          />
        </Col>
        <Col md={6} className="mt-3">
          <Field name="mixed_type_question[value_question_type]">
            {({ field: _field }: FieldProps<string>) => (
              <CustomInputField
                validationSchema={validationSchema}
                label="Question type"
                error={filedError?.value_question_type as string}
                field={_field}
                isCustomRequired
              >
                <Field
                  component={CustomSelect}
                  options={QUESTION_TYPES.slice(0, -1).map((type) => ({
                    value: type,
                    label: convertToPascalCase(type?.replace('_', ' ')),
                  }))}
                  name={_field.name}
                  onFieldUpdate={(e: Option) => {
                    setFieldValue(
                      'mixed_type_question.value_question_type',
                      e?.value,
                    );
                    if (isOptionable(e?.value)) {
                      setFieldValue('mixed_type_question[value_enum]', [
                        initialOption,
                        initialOption,
                      ]);
                    } else {
                      setFieldValue('mixed_type_question[value_enum]', []);
                    }
                  }}
                  isDisabled
                />
              </CustomInputField>
            )}
          </Field>
        </Col>
      </Row>
      {isOptionable(mixedType.value_question_type) && (
        <MixedTypeEnumList
          namePrefix="mixed_type_question[value_enum]"
          options={mixedType?.value_enum}
          errors={errors}
          fieldError={filedError?.value_enum}
          onAddOption={() => setFieldValue('mixed_type_question[value_enum]', [
            ...(mixedType?.value_enum ?? []),
            initialOption,
          ])}
          setFieldValue={setFieldValue}
        />
      )}
      <hr />
      <Row>
        <Col md={6} className="mt-3">
          <FormikField
            name="mixed_type_question[unit_name]"
            type="text"
            validationSchema={validationSchema}
            label="Placeholder"
            errors={errors as Record<string, string>}
            placeholder="Placeholder"
            isCustomRequired
            maxLength={2000}
            customErrorMap={filedError?.unit_name as string}
          />
        </Col>
        <Col md={6} className="mt-3">
          <Field name="mixed_type_question[unit_type]">
            {({ field: _field }: FieldProps<string>) => (
              <CustomInputField
                validationSchema={validationSchema}
                label="Question type"
                error={filedError?.unit_type as string}
                field={_field}
                isCustomRequired
              >
                <Field
                  component={CustomSelect}
                  options={QUESTION_TYPES.slice(0, -1).map((type) => ({
                    value: type,
                    label: convertToPascalCase(type?.replace('_', ' ')),
                  }))}
                  name={_field.name}
                  onFieldUpdate={(e: Option) => {
                    setFieldValue('mixed_type_question.unit_type', e?.value);
                    if (isOptionable(e?.value)) {
                      setFieldValue('mixed_type_question[unit_enum]', [
                        initialOption,
                        initialOption,
                      ]);
                    } else {
                      setFieldValue('mixed_type_question[unit_enum]', []);
                    }
                  }}
                  isDisabled
                />
              </CustomInputField>
            )}
          </Field>
        </Col>
      </Row>
      {isOptionable(mixedType?.unit_type) && (
        <MixedTypeEnumList
          namePrefix="mixed_type_question[unit_enum]"
          options={mixedType?.unit_enum}
          errors={errors}
          fieldError={filedError?.unit_enum}
          onAddOption={() => setFieldValue('mixed_type_question[unit_enum]', [
            ...(mixedType?.unit_enum ?? []),
            initialOption,
          ])}
          setFieldValue={setFieldValue}
        />
      )}
    </div>
  );
}
