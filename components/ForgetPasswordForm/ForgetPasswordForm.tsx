/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { AuthService } from '@/lib/service';
import { Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { object, string } from 'yup';
import Button from '../Button/Button';
import { FormikField } from '../FormikField/FormikField';

interface IProps {
  email: string;
}

export default function ForgetPasswordForm() {
  const router = useRouter();

  const initialValues: IProps = { email: '' };
  const validationSchema = object({
    email: string().trim().email('Invalid email address').required(''),
  });

  const onSubmit = async (
    values: { email: string },
    { setSubmitting, validateForm, setErrors }: FormikHelpers<{ email: string }>,
  ) => {
    try {
      validateForm(values);
      toast?.loading('Forgot password email....');
      const res = await AuthService?.forgotPassword({
        email: values?.email?.trim(),
      });
      const { success, error } = res?.data as {
        success: boolean;
        error: string[];
      };
      toast.dismiss();
      if (success) {
        toast.success(`Email send successfully to ${values?.email}`);
        router.push('/sign_in');
      } else {
        toast.error(error[0]);
        setErrors({ email: error[0] });
      }
    } catch (e: any) {
      toast.dismiss();
      toast.error(e.message);
      setErrors({ email: 'Please enter the valid email' });
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
          <FormikField
            name="email"
            type="email"
            validationSchema={validationSchema}
            label="Your email address"
            errors={errors}
            autoFocus
            placeholder="Enter your email address"
          />
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
              {isSubmitting ? 'sending...' : 'Send recovery email'}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
