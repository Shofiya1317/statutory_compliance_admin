/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IComplianceScope } from '@/lib/interface/IComplianceScope.interface';
import { ComplianceScopeService } from '@/lib/service';
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
  compliance_obligation: string;
  id?: string;
}

// Options populated from Compliance Obligations
const complianceObligationOptions: Option[] = [
  {
    label: 'Quarterly Ambient Air Quality Monitoring',
    value: 'Quarterly Ambient Air Quality Monitoring',
  },
  {
    label: 'Hazardous Waste Manifest Maintenance',
    value: 'Hazardous Waste Manifest Maintenance',
  },
  {
    label: 'Appointment of Safety Officer',
    value: 'Appointment of Safety Officer',
  },
  {
    label: 'Display of Working Hours and Wage Notice',
    value: 'Display of Working Hours and Wage Notice',
  },
];

export default function AddorEditComplianceScope({
  actionType,
  onClose,
  currentComplianceScope,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentComplianceScope?: IComplianceScope | undefined;
}) {
  const router = useRouter();

  const initialValues: IFields = {
    name: currentComplianceScope?.name ?? '',
    description: currentComplianceScope?.description ?? '',
    compliance_obligation: currentComplianceScope?.compliance_obligation ?? '',
    id: currentComplianceScope?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(250, 'Name must be between 3 and 250 characters')
      .min(3, 'Name must be between 3 and 250 characters')
      .required('Name is required'),
    compliance_obligation: string().notRequired(),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Compliance Scope!';
      case 'Edit':
        return 'Updated Compliance Scope!';
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
      compliance_obligation: values.compliance_obligation,
    };
    switch (actionType) {
      case 'Create':
        res = await ComplianceScopeService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await ComplianceScopeService.update(
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
                label="Compliance Scope Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Enter Compliance Scope Name"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="mt-3">
              <Field name="compliance_obligation">
                {({ field }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Compliance Obligation"
                    error={errors.compliance_obligation as string}
                    field={field}
                  >
                    <Field
                      name={field.name}
                      component={CustomSelect}
                      id={field.name}
                      placeholder="Select Compliance Obligation"
                      onChange={(e: Option) => {
                        setFieldValue(field.name, e?.value || '');
                      }}
                      value={
                        complianceObligationOptions.find(
                          (opt) => opt.value === values.compliance_obligation,
                        ) || (values.compliance_obligation
                          ? { label: values.compliance_obligation, value: values.compliance_obligation }
                          : null)
                      }
                      options={complianceObligationOptions}
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
