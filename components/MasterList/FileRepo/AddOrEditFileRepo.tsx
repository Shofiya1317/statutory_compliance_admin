import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { ActionType } from '@/components/types';
import { btnName } from '@/lib/utils';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';
import * as FileRepoService from '@/lib/service/fileRepo';

interface IFields {
  company_name: string;
  year: string;
  report_name: string;
  file_url: string;
  file: File | null;
}

export default function AddOrEditFileRepo({
  actionType,
  onClose,
}: {
  actionType: ActionType;
  onClose?: () => void;
}) {
  const router = useRouter();
  const initialValues: IFields = {
    company_name: '',
    year: '',
    report_name: '',
    file_url: '',
    file: null,
  };

  const validationSchema = object({
    company_name: string().required('Company name is required'),
    year: string().required('Year is required'),
    report_name: string().required('Report name is required'),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastAndCloseModal = (res: any) => {
    const {
      success, error, message,
    } = res?.data || {};

    if (success) {
      toast.success('File uploaded successfully'); // or custom text
      onClose?.();
      router.refresh();
      return;
    }

    // backend might return error array
    if (Array.isArray(error) && error.length) {
      toast.error(error[0]);
      return;
    }

    // fallback message
    if (message) {
      toast.error(message);
      return;
    }

    toast.error('Something went wrong');
  };

  const onSubmit = async (
    values: IFields,
    { validateForm }: FormikHelpers<IFields>,
  ) => {
    await validateForm(values);

    const formData = new FormData();
    formData.append('company_name', values.company_name);
    formData.append('year', values.year);
    formData.append('report_name', values.report_name);
    formData.append(
      'file_url',
      values.file_url && values.file_url.trim() !== ''
        ? values.file_url
        : 'string',
    );
    if (values.file) formData.append('file', values.file);

    const res = await FileRepoService.create(formData);
    toastAndCloseModal(res);
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
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col className="mt-3">
              <FormikField
                name="company_name"
                type="text"
                validationSchema={validationSchema}
                label="Company Name"
                errors={errors as Record<string, string>}
                placeholder="Company Name"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col className="mt-3">
              <FormikField
                name="year"
                type="text"
                validationSchema={validationSchema}
                label="Year"
                errors={errors as Record<string, string>}
                placeholder="Year"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col className="mt-3">
              <FormikField
                name="report_name"
                type="text"
                validationSchema={validationSchema}
                label="Report Name"
                errors={errors as Record<string, string>}
                placeholder="Report Name"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col className="mt-3">
              <FormikField
                name="file_url"
                type="text"
                validationSchema={validationSchema}
                label="File URL"
                errors={errors as Record<string, string>}
                placeholder="File URL"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col className="mt-3">
              <label className="form-label">File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFieldValue('file', e.target.files?.[0] || null)}
              />
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
