/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { Col, Row, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
  array, date, object, string,
} from 'yup';
import Button from '../Button/Button';
import FormikDateField from '../FormikDateField/FormikDateField';
import { FormikField } from '../FormikField/FormikField';
import { CustomInputField } from '../InputField/CustomInputField';

export default function AccountForm({
  account,
  isEdit = false,
  setIsNotEdit,
}: {
  account?: any;
  isEdit?: boolean;
  setIsNotEdit?: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const initialValues = {
    name: account?.name || '',
    location: account?.location || '',
    website: account?.website || '',
    start_date: account?.start_date || '',
    sectors: account?.sectors || '',
    programs_involved: account?.programs_involved || '',
    logo: account?.logo || '',
    proof_certificate: account?.proof_certificate || '',
  };

  const validationSchema = object({
    name: string().required('NGO Name is mandatory'),
    start_date: date().required('Please enter Registered On'),
    website: string().required('Please enter Website'),
    locations: string().required('Please enter locations'),
    programs_involved: array().of(string()).min(1),
    sectors: array().of(string()).min(1),
    logo: string().required('Logo is mandatory'),
    proof_certificate: string().required('Proof Certificate is mandatory'),
  });

  const onSubmit = async (
    values: any,
    { setSubmitting, validateForm }: FormikHelpers<any>,
  ) => {
    const formData = new FormData();
    formData.set('name', values?.name);
    formData.set('website', values?.website);
    formData.set('start_date', values?.start_date);
    formData.set('locations', values?.locations);
    if (Array.isArray(values.programs_involved)) {
      values.programs_involved.map((program: string | Blob, i: any) => formData.set(`programs_involved[${i}]`, program));
    } else {
      formData.set('programs_involved[]', values.programs_involved);
    }

    if (Array.isArray(values.sectors)) {
      values.sectors.map((sector: string | Blob, i: any) => formData.set(`sector[${i}]`, sector));
    } else {
      formData.set('sector[]', values.sectors);
    }
    if (typeof values?.logo === 'object') {
      formData.append('logo', values?.logo);
    } else {
      formData.set('logo', values?.logo);
    }
    if (typeof values?.proof_certificate === 'object') {
      formData.append('proof_certificate', values?.proof_certificate);
    } else {
      formData.set('proof_certificate', values?.proof_certificate);
    }
    try {
      validateForm(values);
      const response = account?.id;
      toast.promise(response as any, {
        loading: 'Creating Account...',
        success: 'Account created successfully',
        error: 'Error while creating Account',
      });

      const res: {
        success: boolean;
        message: string[];
        account?: any;
      } = await response;
      if (res?.success) {
        if (pathname?.includes('/info')) {
          setIsNotEdit(false);
          router?.refresh();
        } else {
          router.push(
            `/accounts/${res?.account?.id}/members?isFormWizard=true` as any,
          );
        }
      } else {
        res?.message?.map((message: string) => toast.error(message));
      }
    } catch (e: any) {
      toast.error(e?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getFileName = () => {
    const proofArray = account?.proof_certificate?.split('/');
    return proofArray;
  };

  const getLogoName = () => {
    const proofArray = account?.logo?.split('/');
    return proofArray;
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
        errors, handleSubmit, isSubmitting, setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className="my-4">
          <Row>
            <Col md={12} lg={6} className="mt-3">
              <FormikField
                name="name"
                type="text"
                validationSchema={validationSchema}
                label="NGO name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="NGO name"
                disabled={isEdit}
              />
            </Col>

            <Col md={12} lg={6} className="mt-3">
              <FormikField
                name="website"
                type="text"
                validationSchema={validationSchema}
                label="Website"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Website"
                disabled={isEdit}
              />
            </Col>
            <Col md={12} lg={6} className="mt-3">
              <FormikDateField
                name="start_date"
                validationSchema={validationSchema}
                label="Registered On"
                errors={errors as string}
                isDisabled={isEdit}
              />
            </Col>
            <Col md={12} lg={6} className="mt-3">
              <Field name="logo">
                {({ field }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Logo"
                    error={errors.logo || ('' as any)}
                    field={field}
                  >
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e: any) => setFieldValue('logo', e.target.files[0])}
                      accept="image/png, image/jpeg, image/jpg"
                      disabled={isEdit}
                    />
                  </CustomInputField>
                )}
              </Field>
              {account?.logo !== 'undefined'
                && account?.logo !== undefined
                && !isEdit && (
                  <div className="mt-3">
                    <a
                      className="position-relative fw-semibold me-3 cursor-pointer text-decoration-none text-center"
                      href={account?.logo}
                      target="_blank"
                    >
                      <span
                        style={{ color: '#305B61' }}
                        className=" text-center"
                      >
                        View Logo
                      </span>
                    </a>
                    <div>{getLogoName()}</div>
                  </div>
              )}
            </Col>
            <Col md={12} lg={6} className="mt-3">
              <Field name="proof_certificate">
                {({ field }: any) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Proof Certificate"
                    error={errors.proof_certificate || ('' as any)}
                    field={field}
                  >
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e: any) => setFieldValue('proof_certificate', e.target.files[0])}
                      accept="image/*,.pdf"
                      disabled={isEdit}
                    />
                  </CustomInputField>
                )}
              </Field>
              {account?.proof_certificate !== 'undefined'
                && account?.proof_certificate !== undefined
                && !isEdit && (
                  <div className="mt-3">
                    <a
                      className="position-relative fw-semibold me-3 cursor-pointer text-decoration-none text-center"
                      href={account?.proof_certificate}
                      target="_blank"
                    >
                      <span
                        style={{ color: '#305B61' }}
                        className=" text-center"
                      >
                        View Proof
                      </span>
                    </a>
                    <div>{getFileName()}</div>
                  </div>
              )}
            </Col>
          </Row>
          <Stack className="align-items-end mt-4">
            {(pathname?.includes('/info') ? !isEdit : true) && (
            <Button
              type="submit"
              className="my-4 py-2 Cancelbtn align-items-center d-flex justify-content-center "
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'save...'
                : pathname?.includes('/info')
                  ? 'Save'
                  : 'Next'}
            </Button>
            )}
          </Stack>
        </form>
      )}
    </Formik>
  );
}
