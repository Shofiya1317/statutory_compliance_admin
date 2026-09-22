import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { ActionType } from '@/components/types';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { ThemeService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';

interface IFields {
  theme_name: string;
  theme_description: string;
  id: string;
}

export default function AddorEditModules({
  actionType,
  onClose,
  currentModule,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentModule?: IThemes | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    theme_name: currentModule?.name ?? '',
    theme_description: currentModule?.description ?? '',
    id: currentModule?.id ?? '',
  };

  const validationSchema = object({
    theme_name: string()
      .max(150, 'Module Name must be between 3 and 150 characters')
      .min(3, 'Module Name must be between 3 and 150 characters')
      .required('Module Name is required'),
    theme_description: string()
      .max(5000, 'Module description must be between 3 and 5000 characters')
      .min(3, 'Module description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Modules!';
      case 'Edit':
        return 'Updated Modules!';
      default:
        return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      toast.error(error[0]);
    }
  };

  const onSubmit = async (
    values: IFields,
    { validateForm }: FormikHelpers<IFields>,
  ) => {
    await validateForm(values);
    let res;
    const params = {
      name: values.theme_name,
      description: values.theme_description,
    };

    switch (actionType) {
      case 'Create':
        res = await ThemeService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await ThemeService.update(params, values?.id || '');
        toastAndCloseModal(res);
        return;
      default:
        // eslint-disable-next-line consistent-return
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
        errors, handleSubmit, isSubmitting, resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Col className="mt-3">
              <FormikField
                name="theme_name"
                type="text"
                validationSchema={validationSchema}
                label="Theme Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Theme Name"
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-3">
              <FormikField
                as="textarea"
                name="theme_description"
                type="text"
                validationSchema={validationSchema}
                label="Description"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Enter your Description"
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
