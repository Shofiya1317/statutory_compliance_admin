'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
  boolean, object, ref, string,
} from 'yup';
import Button from '../Button/Button';
import CustomSelect from '../CustomSelect/CustomSelect';
import { FormikField } from '../FormikField/FormikField';
import { FormikPhoneNumber } from '../FormikPhoneNumber/FormikPhoneNumber';
import { CustomInputField } from '../InputField/CustomInputField';
import { ActionType, Option } from '../types';

interface IFields {
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPERADMIN';
  isUser: boolean;
  id: string;
  phone_number: string;
}

export default function AddorEditUser({
  actionType,
  onClose,
  currentUser,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentUser: IUser | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    first_name: currentUser?.first_name ?? '',
    last_name: currentUser?.last_name ?? '',
    phone_number: currentUser?.phone_number ?? '',
    email: currentUser?.email ?? '',
    role: currentUser?.role?.name ?? 'SUPERADMIN',
    isUser: actionType !== 'Invite',
    id: currentUser?.id ?? '',
  };

  const validationSchema = object({
    email: string()
      .email('Invalid email address')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format',
      )
      .when('isUser', {
        is: actionType === 'Save' || false,
        then: (schema) => schema.required('Email is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    phone_number: string()
      .min(10, 'Min number is 10 digits')
      .when('isUser', {
        is: actionType === 'Save' || actionType !== 'Resend Invitation',
        then: (schema) => schema.required('Phone number is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    first_name: string()
      .matches(
        /^[a-zA-Z\s]*$/,
        'First Name must be contains letters and spaces',
      )
      .max(40, 'First Name must be between 3 and 40 characters')
      .min(3, 'First Name must be between 3 and 40 characters')
      .matches(
        /^(?=.{3,40}$)/,
        'First Name must be between 3 and 40 characters',
      )
      .when('isUser', {
        is: actionType === 'Save' || false,
        then: (schema) => schema.required('First Name is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    last_name: string()
      .matches(/^[a-zA-Z\s]*$/, 'Last Name must be contains letters and spaces')
      .max(40, 'Last Name must be between 3 and 40 characters')
      .min(3, 'Last Name must be between 3 and 40 characters')
      .matches(/^(?=.{3,40}$)/, 'Last Name must be between 3 and 40 characters')
      .when('isUser', {
        is: actionType === 'Save' || false,
        then: (schema) => schema.required('Last Name is required'),
        otherwise: (schema) => schema.notRequired(),
      })
      .notOneOf([ref('first_name')], 'Last Name and First Name are same'),
    role: string().when('isUser', {
      is: actionType === 'Save' || false,
      then: (schema) => schema.required('Role is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    isUser: boolean(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Invite':
        return 'Invite user!';
      case 'Edit':
      case 'Save':
        return 'Updated user!';
      case 'Resend Invitation':
        return 'Invitation resended!';
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
    switch (actionType) {
      case 'Invite':
        res = await UserService.inviteUser({
          email: values.email,
          role: values.role,
          first_name: values.first_name,
          last_name: values.last_name,
        });
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await UserService.updateUserById(
          {
            first_name: values?.first_name,
            last_name: values?.last_name,
            phone_number: values?.phone_number,
            role: values?.role,
          },
          values?.id,
        );
        toastAndCloseModal(res);
        return;
      case 'Resend Invitation':
        res = await UserService.resetInvitation(
          {
            email: values?.email,
          },
          values?.id,
        );
        toastAndCloseModal(res);
        return;
      case 'Save':
        res = await UserService.updateCurrentUser({
          first_name: values?.first_name,
          last_name: values?.last_name,
          phone_number: values?.phone_number,
        });
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
            <Col md={6} className="mt-3">
              <FormikField
                name="first_name"
                type="text"
                validationSchema={validationSchema}
                label="First Name"
                errors={errors}
                autoFocus
                placeholder="First Name"
                isCustomRequired
                disabled={actionType === 'Resend Invitation'}
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="last_name"
                type="text"
                validationSchema={validationSchema}
                label="Last Name"
                errors={errors}
                autoFocus
                isCustomRequired
                placeholder="Last Name"
                disabled={actionType === 'Resend Invitation'}
              />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col md={6} className="mt-3">
              <FormikField
                name="email"
                type="email"
                validationSchema={validationSchema}
                label="Your email address"
                errors={errors}
                isCustomRequired
                placeholder="Enter your email address"
                disabled={
                  actionType !== 'Invite' && actionType === 'Resend Invitation'
                }
              />
            </Col>
            {(actionType === 'Edit' || actionType === 'Save') && (
              <Col md={6} className="mt-3">
                <FormikPhoneNumber
                  name="phone_number"
                  label="Phone Number"
                  errors={errors?.phone_number}
                  validationSchema={validationSchema}
                  isCustomRequired
                />
              </Col>
            )}
            <Col md={6} className="mt-3">
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
                        { value: 'SUPERADMIN', label: 'Super Admin' },
                        { value: 'ADMIN', label: 'Admin' },
                        { value: 'USER', label: 'User' },
                      ]}
                      isDisabled={
                        actionType === 'Resend Invitation'
                        || actionType === 'Save'
                        || currentUser?.role?.name === 'SUPERADMIN'
                      }
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
              {isSubmitting
                ? `${actionType?.includes('Invite') ? 'Invit' : actionType}ing...`
                : actionType}
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
}
