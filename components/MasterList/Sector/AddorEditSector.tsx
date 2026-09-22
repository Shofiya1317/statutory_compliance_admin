import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { ISector } from '@/lib/interface/ISector.interface';
import { SectorService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { array, object, string } from 'yup';
import IndustriesSelect from '../Industries/IndustriesSelect';

interface IFields {
  name: string;
  industries: {
    label: string;
    value: string;
  }[];
  id: string;
}

export default function AddorEditSector({
  actionType,
  onClose,
  currentSector,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentSector?: ISector | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    name: currentSector?.name ?? '',
    industries:
      currentSector?.industry?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [],
    id: currentSector?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(40, 'Sector Name must be between 3 and 40 characters')
      .min(3, 'Sector Name must be between 3 and 40 characters')
      .required('Sector Name is required'),
    industries: array(
      object({
        label: string().notRequired(),
        value: string().notRequired(),
      }),
    ).notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Sector!';
      case 'Edit':
        return 'Updated Sector!';
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
      sector_name: values.name,
      industries: values.industries?.map(
        (item) => (item as unknown as { value: string }).value,
      ),
    };
    switch (actionType) {
      case 'Create':
        res = await SectorService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await SectorService.update(params, values?.id || '');
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
                label="Sector Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Sector Name"
              />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="mt-3">
              <Field name="industries">
                {({ field: formikField }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Industries"
                    field={formikField}
                    error={errors.industries as string}
                  >
                    <Field
                      name="industries"
                      component={IndustriesSelect}
                      id={formikField.name}
                      value={values?.industries}
                      onChange={(e: Option[]) => {
                        setFieldValue('industries', e);
                      }}
                      isMulti
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
