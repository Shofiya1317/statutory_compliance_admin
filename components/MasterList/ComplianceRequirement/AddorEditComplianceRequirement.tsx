import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { ActionType } from '@/components/types';
import { IComplianceRequirement } from '@/lib/interface/IComplianceRequirement.interface';
import { ComplianceRequirementService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';

interface IFields {
  name: string;
  description: string;
  id?: string;
}

export default function AddorEditComplianceRequirement({
  actionType,
  onClose,
  currentComplianceRequirement,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentComplianceRequirement?: IComplianceRequirement | undefined;
}) {
  const router = useRouter();

  const initialValues: IFields = {
    name: currentComplianceRequirement?.name ?? '',
    description: currentComplianceRequirement?.description ?? '',
    id: currentComplianceRequirement?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(250, 'Name must be between 3 and 250 characters')
      .min(3, 'Name must be between 3 and 250 characters')
      .required('Name is required'),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Compliance Requirement!';
      case 'Edit':
        return 'Updated Compliance Requirement!';
      default:
        return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    };
    switch (actionType) {
      case 'Create':
        res = await ComplianceRequirementService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await ComplianceRequirementService.update(
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
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Col className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="Compliance Requirement Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Enter Compliance Requirement Name"
              />
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
