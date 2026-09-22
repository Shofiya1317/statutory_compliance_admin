'use client';

import Button from '@/components/Button/Button';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import FilterHeader from '@/components/Filter/FilterHeader';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { Option } from '@/components/types';
import { QUESTION_TYPES } from '@/lib/config/root_menu';
import {
  applyFilter,
  convertToPascalCase,
  Params,
  resetFilter,
} from '@/lib/utils';
import {
  Field, FieldProps, Form, Formik,
} from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { object, string } from 'yup';
import IndicatorsSelect from '../Indicators/IndicatorsSelect';
import ModulesSelect from '../Modules/ModulesSelect';
import SectorSelect from '../Sector/SectorSelect';
import StandardsSelect from '../Standards/StandardsSelect';

export default function MasterFilter({
  params,
  onCancel,
  slug,
}: {
  params: Params;
  onCancel?: () => void;
  slug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const validationSchema = object().shape({
    sector: object({
      label: string(),
      value: string(),
    }),
    industry: object({
      label: string(),
      value: string(),
    }),
    module: object({
      label: string(),
      value: string(),
    }),
    question_type: string(),
  });

  const initialValues = {
    sector: {
      label: params?.sector_name || '',
      value: params?.sector_id || '',
    },
    industry: {
      label: params?.name || '',
      value: params?.industry_id || '',
    },
    standard: {
      label: params?.standard_name || '',
      value: params?.standard_id || '',
    },
    indicator: {
      label: params?.indicator_name || '',
      value: params?.indicator_id || '',
    },
    theme: {
      label: params?.module_name || '',
      value: params?.module || '',
    },
    question_type: params?.question_type || '',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (value: any) => {
    onCancel?.();
    applyFilter(
      {
        ...value,
        sector_name: value?.sector?.label,
        sector_id: value?.sector?.value,
        name: value?.industry?.label,
        industry_id: value?.industry?.value,
        theme_name: value?.theme?.label,
        theme: value?.theme?.value,
        standard_name: value?.standard?.label,
        standard_id: value?.standard?.value,
        indicator_name: value?.indicator?.label,
        indicator_id: value?.indicator?.value,
        question_type: value?.question_type?.value,
      } as unknown as Params,
      router,
      params as unknown as Params,
      pathname,
    );
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values, errors, handleSubmit, setFieldValue, resetForm,
      }) => (
        <>
          <FilterHeader
            resetButton={() => resetFilter(router, resetForm, pathname)}
          />
          <Form onSubmit={handleSubmit}>
            {slug === 'industries' && (
            <Field name="sector">
              {({ field: formikField }: FieldProps<string>) => (
                <CustomInputField
                  validationSchema={validationSchema}
                  label="Sector"
                  field={formikField}
                  error={errors.sector as string}
                >
                  <Field
                    name={formikField.name}
                    component={SectorSelect}
                    id={formikField.name}
                    value={values?.sector || ''}
                    onChange={(e: Option) => setFieldValue(formikField.name, e)}
                    isMulti={false}
                  />
                </CustomInputField>
              )}
            </Field>
            )}
            {(slug === 'indicators'
              || slug === 'modules'
              || slug === 'questions') && (
              <Field name="standard">
                {({ field: formikField }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="standard"
                    field={formikField}
                    error={errors.standard as string}
                  >
                    <Field
                      name={formikField.name}
                      component={StandardsSelect}
                      id={formikField.name}
                      value={values?.standard || ''}
                      onChange={(e: Option) => setFieldValue(formikField.name, e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
            )}
            {(slug === 'standards'
              || slug === 'modules'
              || slug === 'questions') && (
              <Field name="indicator">
                {({ field: formikField }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Indicator"
                    field={formikField}
                    error={errors.indicator as string}
                  >
                    <Field
                      name={formikField.name}
                      component={IndicatorsSelect}
                      id={formikField.name}
                      value={values?.indicator || ''}
                      onChange={(e: Option) => setFieldValue(formikField.name, e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
            )}
            {(slug === 'standards'
              || slug === 'indicators'
              || slug === 'questions') && (
              <Field name="theme">
                {({ field: formikField }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Theme"
                    field={formikField}
                    error={errors.theme as string}
                  >
                    <Field
                      name={formikField.name}
                      component={ModulesSelect}
                      id={formikField.name}
                      value={values?.theme || ''}
                      onChange={(e: Option) => setFieldValue(formikField.name, e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
            )}
            {slug === 'questions' && (
            <Field name="question_type">
              {({ field: formikField }: FieldProps<string>) => (
                <CustomInputField
                  validationSchema={validationSchema}
                  label="Question Type"
                  field={formikField}
                  error={errors?.question_type as string}
                >
                  <Field
                    name="question_type"
                    component={CustomSelect}
                    id={formikField.name}
                    onChange={(e: Option) => {
                      setFieldValue('question_type', e?.value);
                    }}
                    value={values?.question_type || ''}
                    options={QUESTION_TYPES?.map((item) => ({
                      label: convertToPascalCase(item?.replaceAll('_', ' ')),
                      value: item,
                    }))}
                  />
                </CustomInputField>
              )}
            </Field>
            )}
            <div className="d-flex justify-content-between mt-4 px-5">
              <Button
                onClick={() => {
                  onCancel?.();
                  resetFilter(router, resetForm, pathname);
                }}
                className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="my-4 py-2 btn-sm px-sm-4 savebtn"
              >
                Apply
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
