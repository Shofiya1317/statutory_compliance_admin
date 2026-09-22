'use client';

import { UserService } from '@/lib/service';
import { Formik, FormikHelpers } from 'formik';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { object, ref, string } from 'yup';
import { FormikField } from '../FormikField/FormikField';

interface IField {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

export default function ChangePassword() {
  const [oldPasswordIcon, setOldPasswordIcon] = useState(false);
  const [passwordIcon, setpasswordIcon] = useState(false);
  const [passwordConfirmationIcon, setPasswordConfirmationIcon] = useState(false);
  const initialValues = {
    oldPassword: '',
    password: '',
    passwordConfirmation: '',
  };
  const validationSchema = object({
    oldPassword: string()
      .required('Old Password is requried')
      .min(8, 'Old Password is too short- should be 8 characters  minimum')
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
    password: string()
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
      .matches(/^(?=.{6,20}$)\D*\d/, 'Must Contain One Number')
      .notOneOf([ref('oldPassword')], 'New Password and Old Password are same'),
    passwordConfirmation: string()
      .required('Confirm Password is requried')
      .oneOf([ref('password')], "New Password doesn't match"),
  });

  const onSubmit = async (
    values: IField,
    { setSubmitting, validateForm, setErrors }: FormikHelpers<IField>,
  ) => {
    try {
      validateForm(values);
      const response = UserService?.changePassword(values);
      toast.promise(response, {
        loading: 'Changing Password ...',
        success: 'Password Changed successfully',
        error: 'Error while Changing Password',
      });
      const res = await response;
      const { success, error } = res?.data as {
        success: boolean;
        error: string[];
      };
      if (!success) {
        setErrors({
          oldPassword: error[0],
          password: '',
          passwordConfirmation: '',
        });
      } else {
        signOut();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message);
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
      {({
        errors, handleSubmit, isSubmitting, resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="row p-lg-3">
            <div className=" col-12 mt-3">
              <div className="position-relative">
                <FormikField
                  name="oldPassword"
                  type={oldPasswordIcon ? 'text' : 'password'}
                  validationSchema={validationSchema}
                  label="Old Password"
                  errors={errors}
                  placeholder="Enter your old password"
                  isPassword
                  setPasswordIcon={setOldPasswordIcon}
                  passwordIcon={oldPasswordIcon}
                />
              </div>
            </div>
            <div className="col-lg-6 col-12 mt-3">
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
                />
              </div>
            </div>
            <div className="col-lg-6 col-12 mt-3">
              <div className="position-relative">
                <FormikField
                  name="passwordConfirmation"
                  type={passwordConfirmationIcon ? 'text' : 'password'}
                  validationSchema={validationSchema}
                  label="Confirm Password"
                  errors={errors}
                  placeholder="Enter your confirm password"
                  isPassword
                  setPasswordIcon={setPasswordConfirmationIcon}
                  passwordIcon={passwordConfirmationIcon}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-5 p-lg-3">
            <Button onClick={() => resetForm()} className="Cancelbtn">
              Cancel
            </Button>
            <Button
              type="submit"
              className="ms-3 savebtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reseting Password...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
