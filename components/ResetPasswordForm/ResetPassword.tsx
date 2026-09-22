/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { AuthService } from '@/lib/service';
import { Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { object, ref, string } from 'yup';
import Button from '../Button/Button';
import { FormikField } from '../FormikField/FormikField';

export default function ResetPassword({ token }: { token: string }) {
  const router = useRouter();
  const [passwordIcon, setpasswordIcon] = useState(false);
  const [passwordConfirmationIcon, setPasswordConfirmationIcon] = useState(false);
  const initialValues = {
    password: '',
    password_confirmation: '',
  };
  const validationSchema = object({
    password: string()
      .trim()
      .required('New Password is requried')
      .min(8, 'New Password is too short- should be 8 characters  minimum')
      .matches(/^(?=.{6,})/, 'Must Contain 6 Characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        'Must Contain One Uppercase, One Lowercase',
      )
      .matches(
        /^(?=.*?[!"#$%&'()*+,-./:;<=>?@_`{}~])/,
        'Must Contain One Special Case Character',
      )
      .matches(/^(?=.{6,20}$)\D*\d/, 'Must Contain One Number'),
    password_confirmation: string()
      .trim()
      .required('Confirm Password is requried')
      .oneOf([ref('password')], "Password doesn't match"),
  });
  const onSubmit = async (
    values: {
      password: string;
      password_confirmation: string;
    },
    {
      setSubmitting,
      validateForm,
      setErrors,
    }: FormikHelpers<{
      password: string;
      password_confirmation: string;
    }>,
  ) => {
    try {
      validateForm(values);
      toast.loading('Rest Password...');
      const res = await AuthService?.resetPassword({ ...values, token });
      const { success, error } = res?.data as {
        success: boolean;
        error: string[];
      };
      toast.dismiss();
      if (success) {
        toast.success('Rest Password email successfully');
        router.push('/sign_in');
      } else {
        toast.error(error[0]);
        setErrors({ password: error[0] });
      }
    } catch (e: any) {
      toast?.dismiss();
      toast.error(e.message);
      setErrors({ password: 'Please enter the valid email' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
    >
      {({ errors, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className="position-relative">
            <FormikField
              name="password"
              type={passwordIcon ? 'text' : 'password'}
              validationSchema={validationSchema}
              label="New Password"
              errors={errors}
              placeholder="Enter your new password"
              isPassword
              setPasswordIcon={setpasswordIcon}
              passwordIcon={passwordIcon}
              maxLength={25}
            />
          </div>

          <div className="position-relative mt-3">
            <FormikField
              name="password_confirmation"
              type={passwordConfirmationIcon ? 'text' : 'password'}
              validationSchema={validationSchema}
              label="Confirm Password"
              errors={errors}
              placeholder="Enter your confirm password"
              isPassword
              setPasswordIcon={setPasswordConfirmationIcon}
              passwordIcon={passwordConfirmationIcon}
              maxLength={25}
            />
          </div>
          <Link
            href={{ pathname: '/sign_in' }}
            className="my-3 text-decoration-none float-end fw-medium"
          >
            <span style={{ color: 'var(--btn-primary)' }}>
              I remember my password
            </span>
          </Link>
          <div style={{ width: '100%' }}>
            <Button
              type="submit"
              className="my-4 w-100 savebtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'reseting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
