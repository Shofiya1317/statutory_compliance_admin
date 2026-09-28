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
  status: string;
  id: string;
}

export default function AddorEditCategory({
  actionType,
  onClose,
  currentCategory,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentCategory?: any;
}) {
  const router = useRouter();
  const initialValues = {
    name: currentCategory?.name ?? '',
    description: currentCategory?.description ?? '',
    status: currentCategory?.status ?? 'ACTIVE',
    id: currentCategory?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(150, 'Category Name must be between 3 and 150 characters')
      .min(3, 'Category Name must be between 3 and 150 characters')
      .required('Category Name is required'),
    description: string()
      .max(5000, 'Category description must be between 3 and 5000 characters')
      .min(3, 'Category description must be between 3 and 5000 characters')
      .notRequired(),
    status: string().required('Status is required'),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Category!';
      case 'Edit':
        return 'Updated Category!';
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
                placeholder="Category Name"
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
            <Col className="mt-3">
              <label className="form-label">Status</label>
              <Field
                as="select"
                name="status"
                className={`form-select ${errors?.status ? 'is-invalid' : ''}`}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Field>
              {typeof errors?.status === 'string' && (
                <div className="invalid-feedback d-block">{errors.status}</div>
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
