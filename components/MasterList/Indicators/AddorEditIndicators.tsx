/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IndicatorsService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';
import ModulesSelect from '../Modules/ModulesSelect';

interface IFields {
  indicator_name: string;
  description: string;
  id: string;
}

export default function AddorEditIndicators({
  actionType,
  onClose,
  currentIndicator,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentIndicator?: IIndicator | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    indicator_name: currentIndicator?.name ?? '',
    description: currentIndicator?.description ?? '',
    id: currentIndicator?.id ?? '',
  };

  const validationSchema = object({
    indicator_name: string()
      .max(150, 'Indicator Name must be between 3 and 150 characters')
      .min(3, 'Indicator Name must be between 3 and 150 characters')
      .matches(
        /^[a-zA-Z0-9\s-_]+$/,
        'Indicator Name must not contain special characters',
      )
      .required('Indicator Name is required'),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .min(3, 'Description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Indicator!';
      case 'Edit':
        return 'Updated Indicator!';
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
      name: values.indicator_name,
      description: values.description,
    };
    switch (actionType) {
      case 'Create':
        res = await IndicatorsService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await IndicatorsService.update(params, values?.id || '');
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
        errors,
        handleSubmit,
        isSubmitting,
        resetForm,
        values,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Col className="mt-3">
              <FormikField
                name="indicator_name"
                type="text"
                validationSchema={validationSchema}
                label="Indicator Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Indicator Name"
              />
            </Col>
          </Row>
          <Row className="mt-3">
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
