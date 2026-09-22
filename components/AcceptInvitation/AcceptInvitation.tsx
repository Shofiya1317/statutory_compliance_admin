'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { AuthService } from '@/lib/service';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  boolean, object, ref, string,
} from 'yup';
import { FormikField } from '../FormikField/FormikField';
import { FormikPhoneNumber } from '../FormikPhoneNumber/FormikPhoneNumber';

interface IFields {
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  isAccount: boolean;
}

export default function AcceptInvitation({
  token,
  user,
}: {
  token: string;
  user: IUser;
}) {
  const router = useRouter();
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validationSchema = object({
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
        is: false,
        then: (schema) => schema.required('First Name is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    last_name: string()
      .matches(/^[a-zA-Z\s]*$/, 'Last Name must be contains letters and spaces')
      .max(40, 'Last Name must be between 3 and 40 characters')
      .min(3, 'Last Name must be between 3 and 40 characters')
      .matches(/^(?=.{3,40}$)/, 'Last Name must be between 3 and 40 characters')
      .when('isUser', {
        is: false,
        then: (schema) => schema.required('Last Name is required'),
        otherwise: (schema) => schema.notRequired(),
      })
      .notOneOf([ref('first_name')], 'Last Name and First Name are same'),
    phone_number: string().when('isAccount', {
      is: false,
      then: (schema) => schema.required('Phone Number is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: string()
      .max(40, 'Password must be between 8 and 40 characters')
      .min(8, 'Password must be between 8 and 40 characters')
      .matches(/^(?=.{8,40}$)/, 'Password must be between 8 and 40 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        'Must contains uppercase, special character and number',
      )
      .matches(
        /^(?=.*?[!"#$%&'()*+,-./:;<=>?@_`{}~])/,
        'Must contains uppercase, special character and number',
      )
      .matches(
        /^(?=.*\d)/,
        'Must contains uppercase, special character and number',
      )
      .required('New password is required'),
    confirm_password: string()
      .oneOf([ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
    isAccount: boolean().required(''),
  });

  const onSubmit = async (
    values: IFields,
    { setSubmitting, validateForm, setErrors }: FormikHelpers<IFields>,
  ) => {
    try {
      validateForm(values);
      toast.loading('Updating Profile ...');
      const response = await AuthService?.acceptInvitation(token, {
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        phone_number: values.phone_number,
        confirm_password: values.confirm_password,
        accept_terms_and_conditions: false,
      });
      const { success, message } = (await response?.data) as {
        success: boolean;
        message: string | string[];
      };
      toast.dismiss();
      if (success) {
        toast.success('Profile successfully');
        router.push('/sign_in');
      } else {
        toast.error(message as string);
        if (message && message instanceof Array) {
          message.forEach((msg: string) => {
            const [field, ...value] = msg.split(' ');
            setErrors({ [field]: value?.join(' ') });
          });
        }
        // setErrors({
        //   avatar: message,
        //   proof_certificate: message,
        // });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.dismiss();
      toast.error(e?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className=" d-flex align-items-center pb-4 justify-content-between flex-wrap">
        <div className="d-flex align-items-center me-2">
          <div>
            <h6 className=" fw-semibold m-0 ">{user?.email || '-'}</h6>
          </div>
        </div>
        <h6 className=" fw-semibold m-0 userRole">
          {user?.role?.name?.replace('_', ' ') || '-'}
        </h6>
      </div>
      <Formik
        enableReinitialize
        initialValues={
          {
            email: user.email ?? '',
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            phone_number: user?.phone_number ?? '',
            password: '',
            confirm_password: '',
            isAccount: false,
          } as IFields
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        {({
          errors, handleSubmit, isSubmitting, resetForm, values,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mt-3">
              <FormikField
                name="first_name"
                errors={errors}
                validationSchema={validationSchema}
                label="First Name"
                type="text"
              />
            </div>
            <div className="mt-3">
              <FormikField
                name="last_name"
                errors={errors}
                validationSchema={validationSchema}
                label="Last Name"
                type="text"
              />
            </div>
            <div className="mt-3">
              <FormikField
                name="email"
                errors={errors}
                validationSchema={validationSchema}
                label="Email"
                type="text"
                placeholder="Enter your Name"
                isCustomRequired
                disabled
              />
            </div>
            <div className="mt-3">
              <FormikPhoneNumber
                name="phone_number"
                label="Phone Number"
                errors={errors?.phone_number}
                validationSchema={validationSchema}
                isCustomRequired
              />
            </div>

            <div className="position-relative mt-3">
              <FormikField
                name="password"
                errors={errors}
                validationSchema={validationSchema}
                label="New Password"
                type={newPasswordVisible ? 'text' : 'password'}
                setPasswordIcon={setNewPasswordVisible}
                passwordIcon={newPasswordVisible}
                isPassword
                placeholder="Enter your New password"
              />
            </div>
            <div className="position-relative mt-3">
              <FormikField
                name="confirm_password"
                errors={errors}
                validationSchema={validationSchema}
                label="Confirm Password"
                type={confirmPasswordVisible ? 'text' : 'password'}
                setPasswordIcon={setConfirmPasswordVisible}
                passwordIcon={confirmPasswordVisible}
                isPassword
                placeholder="Enter your Confirm password"
              />
            </div>

            <div className="d-flex justify-content-end mt-5 mb-4">
              <Button onClick={() => resetForm()} className="Cancelbtn me-3">
                Cancel
              </Button>
              <Button
                type="submit"
                className="savebtn"
                disabled={
                  isSubmitting || !isValidPhoneNumber(values?.phone_number)
                }
              >
                {isSubmitting ? 'Completing...' : 'Complete invitation'}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
