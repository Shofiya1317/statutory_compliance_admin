/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */

'use client';

import React from 'react';
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { ActionType } from '@/components/types';
import { IStandard } from '@/lib/interface/IStandard.interface';
import { StandardService } from '@/lib/service';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';

import { CustomInputField } from '@/components/InputField/CustomInputField';
import { btnName } from '@/lib/utils';
import { Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { boolean, object, string } from 'yup';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

interface IFields {
  standard_name: string;
  id: string;
  file: string;
  description: string;
  is_weightage: boolean;
  is_active: boolean;
}

export default function AddorEditStandards({
  actionType,
  onClose,
  currentStandard,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentStandard?: IStandard | undefined;
}) {
  const router = useRouter();
  const initialValues = {
    standard_name: currentStandard?.name ?? '',
    description: currentStandard?.description ?? '',
    id: currentStandard?.id ?? '',
    file: currentStandard?.logo_url ?? '',
    is_weightage: currentStandard?.is_weightage ?? false,
    is_active: currentStandard?.is_active ?? false,
  };

  const validationSchema = object({
    standard_name: string()
      .max(40, 'Standard Name must be between 3 and 40 characters')
      .min(3, 'Standard Name must be between 3 and 40 characters')
      .required('Standard Name is required'),
    description: string()
      .max(5000, 'Standard description must be between 3 and 5000 characters')
      .min(3, 'Standard description must be between 3 and 5000 characters')
      .notRequired(),
    // file: string().required('Logo is required'),
    is_weightage: boolean().oneOf(
      [true, false],
      'Weightage selection is required',
    ),

    is_active: boolean().oneOf([true, false], 'Status selection is required'),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Standard!';
      case 'Edit':
        return 'Updated Standard!';
      default:
        return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastAndCloseModal = (res: any) => {
     const { success, error } = res?.data as {
      success: boolean;
      error: string[];
      standard: IStandard;
    };

    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.push(`/masters/standards/${currentStandard?.id}`);
    } else {
      toast.error(error[0]);
    }
  };

  const toastAndCloseModalEdit = (res: any) => {
    const { success, error } = res?.data as {
      success: boolean;
      error: string[];
      standard: IStandard;
    };

    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.push(`/masters/standards/${currentStandard?.id}/link_themes`);
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
    // const formData = {
    //   standard_name: values?.standard_name,
    //   description: values?.description,
    //   id: values?.id,
    //   file: values?.file,
    //   is_weightage: values?.is_weightage,
    //   is_active: values?.is_active,
    // };

    const formData = new FormData();

    formData.append('name', values.standard_name);
    formData.append('description', values.description || '');

    if (typeof values?.file === 'object') {
      formData.append('file', values?.file);
    } else {
      formData.set('file', values?.file);
    }
    // booleans must be sent as strings in FormData
    formData.append('is_weightage', String(values.is_weightage));
    formData.append('is_active', String(values.is_active));

    switch (actionType) {
      case 'Create':
        // console.log([...formData.entries()], 'form');
        res = await StandardService.create(formData);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await StandardService.update(
          {
            name: values.standard_name,
            description: values?.description,
            is_weightage: values?.is_weightage,
            is_active: values?.is_active,
          },
          values?.id || '',
        );
        toastAndCloseModalEdit(res);
        return;
      default:
        // eslint-disable-next-line consistent-return
        return null;
    }
  };

  // const getLogoName = () => {
  //   const proofArray = currentStandard?.logo_url?.split('/');
  //   return proofArray;
  // };

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
        values,
        handleSubmit,
        isSubmitting,
        resetForm,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <div className="w-100">
              <FormikField
                name="standard_name"
                type="text"
                validationSchema={validationSchema}
                label="Standard Name"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Standard Name"
              />
            </div>
            <div className="mt-3">
              <Field name="file">
                {({ field }: FieldProps<string>) => (
                  <CustomInputField
                    validationSchema={validationSchema}
                    label="Logo File"
                    error={errors?.file ?? ''}
                    field={field}
                  >
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setFieldValue('file', e?.target?.files?.[0])}
                      accept="image/png, image/jpeg, image/jpg"
                      disabled={actionType === 'Edit'}
                    />
                  </CustomInputField>
                )}
              </Field>

              {currentStandard?.logo_url !== 'undefined'
                && currentStandard?.logo_url !== undefined
                && actionType === 'Edit' && (
                  <div className="mt-1 d-flex justify-content-end">
                    <span
                      style={{ color: '#305B61', cursor: 'pointer' }}
                      className="text-center"
                      aria-hidden
                      onClick={() => {
                        const url = currentStandard?.logo_url;
                        if (!url) {
                          // eslint-disable-next-line no-alert
                          alert('No file available to preview or download.');
                          return;
                        }
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      View Logo
                    </span>
                  </div>
                )}
            </div>
            <div className="w-100 mt-3">
              <FormikField
                as="textarea"
                name="description"
                type="text"
                validationSchema={validationSchema}
                label="Description"
                errors={errors as Record<string, string>}
                autoFocus
                placeholder="Enter your Description"
              />
            </div>
            <div className="mt-3">
              <div className="mt-3">
                <Field name="is_weightage">
                  {({ field }: FieldProps<boolean>) => (
                    <CustomInputField
                      validationSchema={validationSchema}
                      label="With Weightage"
                      error={errors.is_weightage as string}
                      field={field}
                      isCustomRequired
                    >
                      <Field
                        name={field.name}
                        component={CustomSelect}
                        id={field.name}
                        onChange={(e: any) => {
                          setFieldValue(field.name, e?.value === true);
                        }}
                        value={
                          values.is_weightage
                            ? { label: 'Yes', value: true }
                            : { label: 'No', value: false }
                        }
                        options={[
                          { label: 'Yes', value: true },
                          { label: 'No', value: false },
                        ]}
                      />
                    </CustomInputField>
                  )}
                </Field>
              </div>
            </div>
            <div className="mt-3">
              <div className="mt-3">
                <Field name="is_active">
                  {({ field }: FieldProps<boolean>) => (
                    <CustomInputField
                      validationSchema={validationSchema}
                      label="Is Active"
                      error={errors.is_active as string}
                      field={field}
                      isCustomRequired
                    >
                      <Field
                        name={field.name}
                        component={CustomSelect}
                        id={field.name}
                        onChange={(e: any) => {
                          setFieldValue(field.name, e?.value === true);
                        }}
                        value={
                          values.is_active
                            ? { label: 'Yes', value: true }
                            : { label: 'No', value: false }
                        }
                        options={[
                          { label: 'Yes', value: true },
                          { label: 'No', value: false },
                        ]}
                      />
                    </CustomInputField>
                  )}
                </Field>
              </div>
            </div>
          </div>
          <Stack direction="horizontal" className="justify-content-end ">
            <Button
              className="my-4 py-2 btn-sm px-sm-4 Cancelbtn me-3"
              onClick={() => {
                if (onClose) {
                  onClose?.();
                } else {
                  router.push('/masters/standards');
                }
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
              {btnName(isSubmitting, actionType)}
            </Button>
            {actionType === 'Edit' && (
              <Button
                className="my-4 py-2 btn-sm px-sm-4 savebtn m-3"
                onClick={() => router.push(
                  `/masters/standards/${currentStandard?.id}/link_themes`,
                )}
              >
                Link Themes
              </Button>
            )}
          </Stack>
        </form>
      )}
    </Formik>
  );
}
