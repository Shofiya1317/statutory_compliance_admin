'use client';

import Button from '@/components/Button/Button';
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

export default function UserFilter({
  params,
  onCancel,
}: {
  params: IUserFilter;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const validationSchema = object().shape({
    role: string(),
    status: string(),
  });

  const initialValues = {
    role: params?.role || '',
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
            <Field name="role">
              {({ field: formikField }: FieldProps<string>) => (
                <CustomInputField
                  validationSchema={validationSchema}
                  label="Role"
                  field={formikField}
                  error={errors?.role as string}
                  isCustomRequired
                >
                  <Field
                    name="role"
                    component={CustomSelect}
                    id={formikField.name}
                    onChange={(e: Option) => {
                      setFieldValue('role', e?.value);
                    }}
                    value={values?.role}
                    options={[
                      { value: '', label: 'All' },
                      { value: 'SUPERADMIN', label: 'Super Admin' },
                      { value: 'ADMIN', label: 'Admin' },
                      { value: 'USER', label: 'User' },
                    ]}
                  />
                </CustomInputField>
              )}
            </Field>
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
