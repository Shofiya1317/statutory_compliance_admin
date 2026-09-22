'use client';

import { Formik, FormikHelpers } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { object, string } from 'yup';
import Button from '../Button/Button';
import { FormikField } from '../FormikField/FormikField';

interface LoginProps {
  email: string;
  password: string;
}

export default function SigninForm() {
  const router = useRouter();
  const [passwordIcon, setPasswordIcon] = useState(false);
  const initialValues: LoginProps = { email: '', password: '' };
  const validationSchema = object({
    email: string()
      .email('Invalid email address')
      .required('Provide valid email address'),
    password: string()
      .required('Provide a valid password')
      .min(8, 'Password is too short - should be 8 characters minimum.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  });

  const onSubmit = async (
    values: LoginProps,
    { setSubmitting, validateForm, setFieldError }: FormikHelpers<LoginProps>,
  ) => {
    validateForm(values);
    setSubmitting(true);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setFieldError('email', 'Accept Invitation / Invalid Email or Password');
    } else {
      toast.success('Signed In');
      router.refresh();
    }

    setSubmitting(false);
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
          <FormikField
            name="email"
            type="email"
            validationSchema={validationSchema}
            label="Your email address"
            errors={errors}
            autoFocus
            placeholder="Enter your email address"
          />
          <div className="position-relative mt-3">
            <FormikField
              name="password"
              type={passwordIcon ? 'text' : 'password'}
              validationSchema={validationSchema}
              label="Password"
              errors={errors}
              placeholder="Enter your password"
              isPassword
              setPasswordIcon={setPasswordIcon}
              passwordIcon={passwordIcon}
            />
          </div>
          <Link
            href={{ pathname: '/forget_password' }}
            className="my-3 text-decoration-none float-end fw-medium"
          >
            <span style={{ color: '#305B61' }}>I forgot my password </span>
          </Link>
          <div style={{ width: '100%' }}>
            <Button
              type="submit"
              className="my-4 w-100 Loginbtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing...' : 'Sign in'}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
