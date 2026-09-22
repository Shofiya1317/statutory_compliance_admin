'use client';

import Button from '@/components/Button/Button';
import { IAccountFilter } from '@/lib/interface/IAccount.interface';
import {
  Field, FieldProps, Form, Formik,
} from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { object, string } from 'yup';
import { IUserFilter } from '../../../lib/interface/IUser.interface';
import { applyFilter, Params, resetFilter } from '../../../lib/utils';
import CustomSelect from '../../CustomSelect/CustomSelect';
import { CustomInputField } from '../../InputField/CustomInputField';
import { Option } from '../../types';
import FilterHeader from '../FilterHeader';

export default function AccountFilter({
  params,
  onCancel,
}: {
  params: IAccountFilter;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const validationSchema = object().shape({
    status: string(),
  });

  const initialValues = {
    status: params?.status || '',
  };

  const onSubmit = (value: IUserFilter) => {
    onCancel?.();
    applyFilter(
      value as unknown as Params,
      router,
      params as unknown as Params,
      pathname,
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values, errors, handleSubmit, setFieldValue, resetForm,
      }) => (
        <>
          <FilterHeader
            resetButton={() => resetFilter(router, resetForm, pathname)}
          />
          <Form onSubmit={handleSubmit}>
            <Field name="status">
              {({ field: formikField }: FieldProps<string>) => (
                <CustomInputField
                  validationSchema={validationSchema}
                  label="Status"
                  field={formikField}
                  error={errors?.status as string}
                  isCustomRequired
                >
                  <Field
                    name="status"
                    component={CustomSelect}
                    id={formikField.name}
                    onChange={(e: Option) => {
                      setFieldValue('status', e?.value);
                    }}
                    value={values?.status}
                    options={[
                      { value: '', label: 'All' },
                      { value: 'ACTIVE', label: 'Active' },
                      { value: 'PENDING', label: 'Pending' },
                      { value: 'INACTIVE', label: 'InActive' },
                      { value: 'BLOCKED', label: 'Blocked' },
                      { value: 'SUSPEND', label: 'Suspended' },
                      { value: 'DELETED', label: 'Deleted' },
                    ]}
                  />
                </CustomInputField>
              )}
            </Field>
            <div className="d-flex justify-content-between mt-4 px-5">
              <Button
                onClick={() => {
                  onCancel?.();
                  resetFilter(router, resetForm, pathname);
                }}
                className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="my-4 py-2 btn-sm px-sm-4 savebtn"
              >
                Apply
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
