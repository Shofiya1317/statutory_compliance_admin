/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount } from '@/lib/interface/IAccount.interface';
import { AccountService, AuthService } from '@/lib/service';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { object, string } from 'yup';
import Button from '../Button/Button';
import { FormikField } from '../FormikField/FormikField';
import { FormikPhoneNumber } from '../FormikPhoneNumber/FormikPhoneNumber';
import { ActionType } from '../types';

interface IFields {
  name: string;
  account_name: string;
  slug: string;
  phone_number: string;
  email: string;
}

export default function AddorEditAccount({
  actionType,
  onClose,
  currentAcction,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentAcction?: IAccount | undefined;
}) {
  const [isManual, setIsManual] = useState(false);

  const initialValues = {
    name: currentAcction?.name ?? '',
    account_name: currentAcction?.account_name ?? '',
    slug: currentAcction?.slug ?? '',
    phone_number: currentAcction?.phone_number ?? '',
    email: currentAcction?.email ?? '',
  };

  const validationSchema = object({
    email: string()
      .email('Invalid email address')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format',
      )
      .required('Email is required'),
    phone_number: string().min(10, 'Min number is 10 digits'),
    name: string()
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
      .required('Name is required'),
    slug: string()
      .max(20, 'Workspace URL must be between 4 and 20 characters')
      .min(4, 'Workspace URL must be between 4 and 20 characters')
      .matches(
        /^(?=.{4,20}$)/,
        'Workspace URL must be between 4 and 20 characters',
      )
      .required('Workspace URL is required'),
    account_name: string()
      .trim()
      .max(40, 'Organisation name must be between 4 and 40 characters')
      .min(4, 'Organisation name must be between 4 and 40 characters')
      .matches(
        /^(?=.{4,40}$)/,
        'Organisation name must be between 4 and 40 characters',
      )
      .required('Organisation name must contain letters and spaces'),
  });

  const onSubmit = async (
    values: IFields,
    formikHelpers: FormikHelpers<IFields>,
  ) => {
    if (
      values?.phone_number?.length > 0
      && !isValidPhoneNumber(values?.phone_number)
    ) {
      formikHelpers.setFieldError('phone_number', 'Must be valid Phone Number');
    } else {
      let res;
      const params = { ...values };
      if (!params?.phone_number?.length) {
        delete (params as any)?.phone_number;
      }
      if (actionType === 'Invite') {
        res = await AccountService?.createAccount(params);
      } else {
        res = await AccountService.resendInvitation({
          email: params?.email,
          slug: params?.slug,
        });
      }
      await formikHelpers.validateForm(values);
      const { success, error } = res?.data as unknown as {
        success: boolean;
        error: string[];
      };
      if (success) {
        toast.success(`Account ${actionType}!`);
        onClose?.();
      } else {
        toast.error(error[0]);
      }
    }
  };

  const setError = (message: string, setFieldError?: any) => {
    if (setFieldError) {
      setFieldError('slug', message);
    }
  };

  const verifySlug = async (
    slug: string,
    setFieldValue?: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<IFields>> | undefined,
    setFieldError?: (field: string, message: string | undefined) => void,
  ) => {
    if (slug.length < 4) {
      setError(
        'Workspace URL must be between 4 and 20 characters',
        setFieldError,
      );
      return;
    }
    let counter = 1;
    let generatedSlug = slug;
    setError('', setFieldError);
    localStorage.setItem('slug', generatedSlug);
    const res = await AuthService.slugVerify(generatedSlug);
    const { success, message } = res?.data as {
      success: boolean;
      message: string;
    };
    if (success) {
      setError('', setFieldError);
    } else {
      setError('Workspace URL already taken', setFieldError);

      if (setFieldValue) {
        const baseSlug = slug.replace(/\d+$/, '');
        while (
          !success
          && (message?.length || message?.length)
          && counter <= 100
        ) {
          generatedSlug = `${baseSlug}${counter}`;
          const resultRes = await AuthService.slugVerify(generatedSlug);
          const result = resultRes?.data as {
            success: boolean;
            message: string;
          };
          if (result.success) {
            setError('', setFieldError);
            break;
          }
          counter += 1;
        }
        setFieldValue('slug', generatedSlug);
        if (counter > 100) {
          setError(
            'Could not generate a unique slug after multiple attempts.',
            setFieldError,
          );
        }
      } else {
        setError('Workspace URL already taken', setFieldError);
      }
    }
  };

  const formatSlugName = (inputName: string) => {
    const name = inputName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '');

    const words = name.split(' ').filter(Boolean);
    const wordCount = words.length;

    if (!name.includes(' ') && name.length > 10) {
      return name.slice(0, 10);
    }

    if (wordCount >= 1 && wordCount <= 3) {
      let result = words[0];

      if (result.length < 4) {
        // eslint-disable-next-line no-plusplus
        for (let i = 1; i < wordCount && result.length < 4; i++) {
          result += words[i].slice(0, 4 - result.length);
        }
      }

      return result.length > 10 ? result.slice(0, 10) : result;
    }

    if (wordCount > 3) {
      const formattedName = words.map((word) => word.charAt(0)).join('');
      return formattedName.length > 10
        ? formattedName.slice(0, 10)
        : formattedName;
    }

    return name.length > 10 ? name.slice(0, 10) : name;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedVerifySlug = useCallback(
    debounce((formattedValue, setFieldValue, setFieldError) => {
      verifySlug(formattedValue, setFieldValue, setFieldError);
    }, 1000),
    [],
  );

  const handleOrganisationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<IFields>> | undefined,
    setFieldError: (field: string, message: string | undefined) => void,
  ) => {
    let value = e?.target?.value;
    if (value.startsWith(' ')) {
      value = value.trimStart();
    }

    if (!isManual) {
      const formattedValue = formatSlugName(value);
      debouncedVerifySlug(formattedValue, setFieldValue, setFieldError);
      setFieldValue('slug', formattedValue);
    }

    setFieldValue('account_name', value);
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
        setFieldError,
      }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="Name"
                errors={errors}
                autoFocus
                placeholder="Name"
                disabled={actionType === 'Resend Invitation'}
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikPhoneNumber
                name="phone_number"
                label="Phone Number"
                errors={errors?.phone_number}
                validationSchema={validationSchema}
                isDisabled={actionType === 'Resend Invitation'}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <FormikField
                name="email"
                type="email"
                validationSchema={validationSchema}
                label="Your email address"
                errors={errors}
                placeholder="Enter your email address"
                disabled={actionType === 'Resend Invitation'}
              />
            </Col>
            <Col md={6} className="mt-3">
              <FormikField
                name="account_name"
                label="Organisation Name"
                type="text"
                placeholder="Enter your Organisation Name"
                value={values.account_name}
                onChange={(e) => {
                  handleOrganisationChange(e, setFieldValue, setFieldError);
                }}
                validationSchema={validationSchema}
                errors={errors}
                disabled={actionType === 'Resend Invitation'}
              />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="mt-3">
              <FormikField
                name="slug"
                label="Workspace URL"
                type="text"
                placeholder="Enter your Workspace URL"
                rightIcon
                icon={<p>.rubicr.ai</p>}
                value={values.slug}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setIsManual(true);
                  const slugValue = e?.target?.value?.replace(
                    /[^A-Za-z0-9]/g,
                    '',
                  );
                  setFieldValue('slug', slugValue);
                  if (slugValue?.length > 3) {
                    verifySlug(slugValue, undefined, setFieldError);
                  }
                }}
                validationSchema={validationSchema}
                errors={errors}
                disabled={
                  !values?.account_name || actionType === 'Resend Invitation'
                }
              />
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
