import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IIndustries } from '@/lib/interface/IIndustries.interface';
import { IndustryService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { object, string } from 'yup';
import SectorSelect from '../Sector/SectorSelect';

interface IFields {
  name: string;
  description: string;
  id: string;
  sector: {
    label: string;
    value: string;
  };
}

export default function AddorEditIndusties({
  actionType,
  onClose,
  currentIndustry,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentIndustry?: IIndustries | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    name: currentIndustry?.name ?? '',
    description: currentIndustry?.description ?? '',
    sector: {
      label: currentIndustry?.sector?.name ?? '',
      value: currentIndustry?.sector?.id ?? '',
    },
    id: currentIndustry?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(150, 'Industry Name must be between 3 and 150 characters')
      .min(3, 'Industry Name must be between 3 and 150 characters')
      .required('Industry Name is required'),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .min(3, 'Description must be between 3 and 5000 characters'),
    sector: object({
      label: string().notRequired(),
      value: string().notRequired(),
    }).notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Industry!';
      case 'Edit':
        return 'Updated Industry!';
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
      industry_name: values.name,
      description: values.description,
      sector: values.sector?.value,
    };
    switch (actionType) {
      case 'Create':
        res = await IndustryService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await IndustryService.update(params, values?.id || '');
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
                label="Industry Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Industry Name"
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
          <Row className="mb-5">
            <Col className="mt-3">
              <Field name="sector">
                {({ field: formikField }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Sector"
                    field={formikField}
                    error={errors.sector as string}
                  >
                    <Field
                      name={formikField.name}
                      component={SectorSelect}
                      id={formikField.name}
                      value={values?.sector}
                      onChange={(e: Option) => setFieldValue(formikField.name, e)}
                      isMulti={false}
                    />
                  </CustomInputField>
                )}
              </Field>
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
