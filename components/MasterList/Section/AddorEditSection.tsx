import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { ActionType } from '@/components/types';
import { btnName } from '@/lib/utils';
import { Field, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';

interface IFields {
  name: string;
  description: string;
  act: string;
  sequence: string;
  status: string;
  id: string;
}

export default function AddorEditSection({
  actionType,
  onClose,
  currentSection,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentSection?: any;
}) {
  const router = useRouter();
  const initialValues = {
    name: currentSection?.name ?? '',
    description: currentSection?.description ?? '',
    act: currentSection?.act ?? '',
    sequence: currentSection?.sequence ?? '',
    status: currentSection?.status ?? 'ACTIVE',
    id: currentSection?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(150, 'Section Name must be between 3 and 150 characters')
      .min(3, 'Section Name must be between 3 and 150 characters')
      .required('Section Name is required'),
    description: string()
      .max(5000, 'Section description must be between 3 and 5000 characters')
      .min(3, 'Section description must be between 3 and 5000 characters')
      .notRequired(),
    act: string().notRequired(),
    sequence: string().notRequired(),
    status: string().required('Status is required'),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Section!';
      case 'Edit':
        return 'Updated Section!';
      default:
        return '';
    }
  };

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
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const onSubmit = async (
    values: IFields,
    { validateForm }: FormikHelpers<IFields>,
  ) => {
    await validateForm(values);

    const params = {
      name: values.name,
      description: values.description,
      act: values.act,
      sequence: values.sequence,
      status: values.status,
    };

    switch (actionType) {
      case 'Create':
        toastAndCloseModal({ data: { success: true, error: [] } });
        return;
      case 'Edit':
        toastAndCloseModal({ data: { success: true, error: [] } });
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
      {({ errors, handleSubmit, isSubmitting, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Col className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Section Name"
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
                placeholder="Enter your Description"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="act"
                type="text"
                validationSchema={validationSchema}
                label="Act"
                errors={errors as Record<string, string>}
                placeholder="Act"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="sequence"
                type="text"
                validationSchema={validationSchema}
                label="Sequence"
                errors={errors as Record<string, string>}
                placeholder="Sequence"
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-3">
              <label className="form-label">Status</label>
              <Field
                as="select"
                name="status"
                className={`form-select ${
                  (errors as Record<string, string>).status
                    ? 'is-invalid'
                    : ''
                }`}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Field>
              {typeof (errors as Record<string, unknown>).status ===
                'string' && (
                <div className="invalid-feedback d-block">
                  {(errors as Record<string, string>).status}
                </div>
              )}
            </Col>
          </Row>
          <Stack direction="horizontal" className="justify-content-end ">
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
