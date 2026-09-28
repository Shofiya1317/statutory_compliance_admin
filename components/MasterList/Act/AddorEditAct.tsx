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
  category: string;
  frequency: string;
  due_date: string;
  short_name: string;
  act_number: string;
  act_type: string;
  government_level: string;
  jurisdiction: string;
  enactment_date: string;
  effective_from: string;
  effective_to: string;
  status: string;
  id: string;
}

export default function AddorEditAct({
  actionType,
  onClose,
  currentAct,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentAct?: any;
}) {
  const router = useRouter();
  const initialValues = {
    name: currentAct?.name ?? '',
    description: currentAct?.description ?? '',
    category: currentAct?.category ?? '',
    frequency: currentAct?.frequency ?? '',
    due_date: currentAct?.due_date ?? '',
    short_name: currentAct?.short_name ?? '',
    act_number: currentAct?.act_number ?? '',
    act_type: currentAct?.act_type ?? '',
    government_level: currentAct?.government_level ?? '',
    jurisdiction: currentAct?.jurisdiction ?? '',
    enactment_date: currentAct?.enactment_date ?? '',
    effective_from: currentAct?.effective_from ?? '',
    effective_to: currentAct?.effective_to ?? '',
    status: currentAct?.status ?? 'ACTIVE',
    id: currentAct?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(150, 'Act Name must be between 3 and 150 characters')
      .min(3, 'Act Name must be between 3 and 150 characters')
      .required('Act Name is required'),
    description: string()
      .max(5000, 'Act description must be between 3 and 5000 characters')
      .min(3, 'Act description must be between 3 and 5000 characters')
      .notRequired(),
    category: string().notRequired(),
    frequency: string().notRequired(),
    due_date: string().notRequired(),
    short_name: string().notRequired(),
    act_number: string().notRequired(),
    act_type: string().notRequired(),
    government_level: string().notRequired(),
    jurisdiction: string().notRequired(),
    enactment_date: string().notRequired(),
    effective_from: string().notRequired(),
    effective_to: string().notRequired(),
    status: string().required('Status is required'),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Act!';
      case 'Edit':
        return 'Updated Act!';
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
      category: values.category,
      frequency: values.frequency,
      due_date: values.due_date,
      short_name: values.short_name,
      act_number: values.act_number,
      act_type: values.act_type,
      government_level: values.government_level,
      jurisdiction: values.jurisdiction,
      enactment_date: values.enactment_date,
      effective_from: values.effective_from,
      effective_to: values.effective_to,
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
            <Col md={6} className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Act Name"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="short_name"
                type="text"
                validationSchema={validationSchema}
                label="Short Name"
                errors={errors as Record<string, string>}
                placeholder="Short Name"
              />
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mt-3">
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

          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="category"
                type="text"
                validationSchema={validationSchema}
                label="Category"
                errors={errors as Record<string, string>}
                placeholder="Category"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="frequency"
                type="text"
                validationSchema={validationSchema}
                label="Frequency"
                errors={errors as Record<string, string>}
                placeholder="Frequency"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="due_date"
                type="text"
                validationSchema={validationSchema}
                label="Due Date"
                errors={errors as Record<string, string>}
                placeholder="Due Date"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="act_number"
                type="text"
                validationSchema={validationSchema}
                label="Act Number"
                errors={errors as Record<string, string>}
                placeholder="Act Number"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="act_type"
                type="text"
                validationSchema={validationSchema}
                label="Act Type"
                errors={errors as Record<string, string>}
                placeholder="Act Type"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="government_level"
                type="text"
                validationSchema={validationSchema}
                label="Government Level"
                errors={errors as Record<string, string>}
                placeholder="Government Level"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="jurisdiction"
                type="text"
                validationSchema={validationSchema}
                label="Jurisdiction"
                errors={errors as Record<string, string>}
                placeholder="Jurisdiction"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="enactment_date"
                type="date"
                validationSchema={validationSchema}
                label="Enactment Date"
                errors={errors as Record<string, string>}
                placeholder="YYYY-MM-DD"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="effective_from"
                type="date"
                validationSchema={validationSchema}
                label="Effective From"
                errors={errors as Record<string, string>}
                placeholder="YYYY-MM-DD"
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="effective_to"
                type="date"
                validationSchema={validationSchema}
                label="Effective To"
                errors={errors as Record<string, string>}
                placeholder="YYYY-MM-DD"
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
