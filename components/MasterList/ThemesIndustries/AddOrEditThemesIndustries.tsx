/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IThemesIndustries } from '@/lib/interface/IThemesIndustries.interface';
import { ThemeIndustriesService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string, number } from 'yup';
import IndustriesSelect from '../Industries/IndustriesSelect';
import ModulesSelect from '../Modules/ModulesSelect';

interface IFields {
  theme: Option | null;
  industry: Option | null;
  weightage: number;
  id: string;
}

export default function AddOrEditThemesIndustries({
  actionType,
  onClose,
  currentModule,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentModule?: IThemesIndustries | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    theme: currentModule?.theme
      ? {
        label: `${currentModule.theme.name} - ${currentModule.theme?.standard?.name ?? ''}`,
        value: currentModule.theme.id,
      }
      : null,
    industry: currentModule?.industry
      ? {
        label: currentModule.industry.name,
        value: currentModule.industry.id,
      }
      : null,
    weightage: currentModule?.weightage ?? 0,
    id: currentModule?.id ?? '',
  };

  const validationSchema = object({
    theme: object().required('Theme is required'),
    industry: object().required('Industry is required'),
    weightage: number()
      .required('Weightage is required')
      .min(0, 'Weightage must be at least 0')
      .transform((value, originalValue) => {
        // Transform empty string or invalid values to 0
        if (originalValue === '' || originalValue === null || originalValue === undefined) {
          return 0;
        }
        const num = Number(originalValue);
        return Number.isNaN(num) ? 0 : num; // Fixed: using Number.isNaN instead of isNaN
      }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastAndCloseModal = (res: any) => {
    const { message, error } = res?.data as {
      message?: string;
      error?: string[];
    };

    if (message) {
      toast.success(message);
      onClose?.();
      router.refresh();
    } else if (error && error.length) {
      toast.error(error[0]);
    } else {
      toast.error('Something went wrong');
    }
  };

  const onSubmit = async (
    values: IFields,
    { validateForm, setSubmitting }: FormikHelpers<IFields>,
  ) => {
    try {
      await validateForm(values);

      // CRITICAL FIX: Ensure weightage is always a number
      // This solves the issue when submitting without any changes
      const weightageValue = typeof values.weightage === 'number'
        ? values.weightage
        : Number(values.weightage);

      const params = {
        theme_id: values.theme?.value || '',
        industry_id: values.industry?.value || '',
        weightage: Number.isNaN(weightageValue) ? 0 : weightageValue,
      };

      let res;
      switch (actionType) {
        case 'Create':
          res = await ThemeIndustriesService.create(params);
          toastAndCloseModal(res);
          break;
        case 'Edit':
          res = await ThemeIndustriesService.update(params, values?.id || '');
          toastAndCloseModal(res);
          break;
        default:
          toast.error('Invalid action type');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          <Row className="mb-2">
            <Col className="mt-3">
              <Field name="theme">
                {({ field: formikField }: FieldProps<Option | null>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Themes"
                    field={formikField}
                    error={errors.theme as string}
                  >
                    <Field
                      name="theme"
                      component={ModulesSelect}
                      id="theme"
                      value={values.theme}
                      onChange={(e: Option | null) => setFieldValue('theme', e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col className="mt-3">
              <Field name="industry">
                {({ field: formikField }: FieldProps<Option | null>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Industry"
                    field={formikField}
                    error={errors.industry as string}
                  >
                    <Field
                      name="industry"
                      component={IndustriesSelect}
                      id="industry"
                      value={values.industry}
                      onChange={(e: Option | null) => setFieldValue('industry', e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
            </Col>
          </Row>

          <Row>
            <Col className="mt-3">
              <FormikField
                name="weightage"
                type="number"
                validationSchema={validationSchema}
                label="Weightage"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Weightage"
              />
            </Col>
          </Row>

          <Stack direction="horizontal" className="justify-content-end">
            <Button
              className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
              onClick={() => {
                onClose?.();
                resetForm();
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="my-4 py-2 btn-sm px-sm-4 savebtn"
              disabled={isSubmitting}
            >
              {btnName(isSubmitting, actionType)}
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
}
