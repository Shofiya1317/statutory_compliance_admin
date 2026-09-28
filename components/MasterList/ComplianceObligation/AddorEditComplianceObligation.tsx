/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IComplianceObligation } from '@/lib/interface/IComplianceObligation.interface';
import { ComplianceObligationService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';

interface IFields {
  name: string;
  description: string;
  section: string;
  applicability_rule: string;
  id?: string;
}

// Placeholder options until Section & Applicability Rules master tabs and APIs are live
const sectionOptions: Option[] = [
  { label: 'Section 21 - Air Pollution Control', value: 'Section 21' },
  { label: 'Section 6 - Hazardous Waste Handling', value: 'Section 6' },
  { label: 'Section 40-B - Safety Officers', value: 'Section 40-B' },
  { label: 'Section 108 - Display of Notices', value: 'Section 108' },
];

const applicabilityRuleOptions: Option[] = [
  {
    label: 'Manufacturing units with boiler capacity > 2 TPH',
    value: 'Manufacturing units with boiler capacity > 2 TPH',
  },
  {
    label: 'All hazardous waste generating facilities',
    value: 'All hazardous waste generating facilities',
  },
  {
    label: 'Factories employing 1000 or more workers',
    value: 'Factories employing 1000 or more workers',
  },
  {
    label: 'All commercial and industrial establishments',
    value: 'All commercial and industrial establishments',
  },
];

export default function AddorEditComplianceObligation({
  actionType,
  onClose,
  currentComplianceObligation,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentComplianceObligation?: IComplianceObligation | undefined;
}) {
  const router = useRouter();

  const initialValues: IFields = {
    name: currentComplianceObligation?.name ?? '',
    description: currentComplianceObligation?.description ?? '',
    section: currentComplianceObligation?.section ?? '',
    applicability_rule: currentComplianceObligation?.applicability_rule ?? '',
    id: currentComplianceObligation?.id ?? '',
  };

  // section and applicability_rule are optional right now since their master tabs/APIs are not yet ready
  const validationSchema = object({
    name: string()
      .max(250, 'Name must be between 3 and 250 characters')
      .min(3, 'Name must be between 3 and 250 characters')
      .required('Name is required'),
    section: string().notRequired(),
    applicability_rule: string().notRequired(),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Compliance Obligation!';
      case 'Edit':
        return 'Updated Compliance Obligation!';
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
    const params = {
      name: values.name,
      description: values.description,
      section: values.section,
      applicability_rule: values.applicability_rule,
    };
    switch (actionType) {
      case 'Create':
        res = await ComplianceObligationService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await ComplianceObligationService.update(
          params,
          values?.id || '',
        );
        toastAndCloseModal(res);
        return;
      default:
        return null;
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
          <Row>
            <Col className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="Compliance Obligation Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Enter Compliance Obligation Name"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="mt-3">
              <Field name="section">
                {({ field }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Section"
                    error={errors.section as string}
                    field={field}
                  >
                    <Field
                      name={field.name}
                      component={CustomSelect}
                      id={field.name}
                      placeholder="Select Section (from Section tab)"
                      onChange={(e: Option) => {
                        setFieldValue(field.name, e?.value || '');
                      }}
                      value={
                        sectionOptions.find(
                          (opt) => opt.value === values.section,
                        ) || (values.section ? { label: values.section, value: values.section } : null)
                      }
                      options={sectionOptions}
                      isClearable
                    />
                  </CustomInputField>
                )}
              </Field>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="mt-3">
              <Field name="applicability_rule">
                {({ field }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Applicability Rule"
                    error={errors.applicability_rule as string}
                    field={field}
                  >
                    <Field
                      name={field.name}
                      component={CustomSelect}
                      id={field.name}
                      placeholder="Select Applicability Rule (from Applicability Rules tab)"
                      onChange={(e: Option) => {
                        setFieldValue(field.name, e?.value || '');
                      }}
                      value={
                        applicabilityRuleOptions.find(
                          (opt) => opt.value === values.applicability_rule,
                        ) || (values.applicability_rule
                          ? { label: values.applicability_rule, value: values.applicability_rule }
                          : null)
                      }
                      options={applicabilityRuleOptions}
                      isClearable
                    />
                  </CustomInputField>
                )}
              </Field>
            </Col>
          </Row>

          <Row className="mt-3 mb-4">
            <Col className="mt-3">
              <FormikField
                as="textarea"
                name="description"
                type="text"
                validationSchema={validationSchema}
                label="Description"
                errors={errors as Record<string, string>}
                placeholder="Enter Description"
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
