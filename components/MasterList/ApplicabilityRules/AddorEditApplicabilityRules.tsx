/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikField } from '@/components/FormikField/FormikField';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { CustomInputField } from '@/components/InputField/CustomInputField';
import { ActionType, Option } from '@/components/types';
import { IApplicabilityRules } from '@/lib/interface/IApplicabilityRules.interface';
import { ApplicabilityRulesService } from '@/lib/service';
import { btnName } from '@/lib/utils';
import {
  Field, FieldProps, Formik, FormikHelpers,
} from 'formik';
import { useRouter } from 'next/navigation';
import IndustriesSelect from '@/components/MasterList/Industries/IndustriesSelect';
import {
  Button, Col, Row,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import { array, object, string } from 'yup';

interface IFields {
  name: string;
  description: string;
  state: string;
  service: string;
  sector: string;
  industries: Option[];
  listing_status: string;
  location: string;
  employee_count: string;
  revenue_band: string;
  id?: string;
}

const sectorOptions: Option[] = [
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Chemical & Petrochemical', value: 'Chemical & Petrochemical' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Information Technology', value: 'Information Technology' },
  { label: 'Healthcare & Pharma', value: 'Healthcare & Pharma' },
  { label: 'Financial Services', value: 'Financial Services' },
];

const listingStatusOptions: Option[] = [
  { label: 'Listed', value: 'Listed' },
  { label: 'Unlisted', value: 'Unlisted' },
];

const employeeCountOptions: Option[] = [
  { label: '1 - 50', value: '1 - 50' },
  { label: '50 - 250', value: '50 - 250' },
  { label: '250 - 500', value: '250 - 500' },
  { label: '500 - 1000', value: '500 - 1000' },
  { label: '> 1000', value: '> 1000' },
];

const revenueBandOptions: Option[] = [
  { label: '< ₹5 Cr', value: '< ₹5 Cr' },
  { label: '₹5 Cr - ₹25 Cr', value: '₹5 Cr - ₹25 Cr' },
  { label: '₹25 Cr - ₹100 Cr', value: '₹25 Cr - ₹100 Cr' },
  { label: '₹100 Cr - ₹500 Cr', value: '₹100 Cr - ₹500 Cr' },
  { label: '> ₹500 Cr', value: '> ₹500 Cr' },
];

const stateOptions: Option[] = [
  { label: 'All India', value: 'All India' },
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Delhi NCR', value: 'Delhi NCR' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
];

export default function AddorEditApplicabilityRules({
  actionType,
  onClose,
  currentApplicabilityRule,
}: {
  actionType: ActionType;
  onClose?: () => void;
  currentApplicabilityRule?: IApplicabilityRules | undefined;
}) {
  const router = useRouter();

  const getInitialIndustries = (): Option[] => {
    const raw: any = currentApplicabilityRule?.industries;
    if (Array.isArray(raw)) {
      return raw.map((ind: string) => ({
        label: ind,
        value: ind,
      }));
    }
    if (typeof raw === 'string' && raw) {
      return raw
        .split(',')
        .map((ind: string) => ind.trim())
        .filter(Boolean)
        .map((ind: string) => ({ label: ind, value: ind }));
    }
    return [];
  };

  const initialValues: IFields = {
    name: currentApplicabilityRule?.name ?? '',
    description: currentApplicabilityRule?.description ?? '',
    state: currentApplicabilityRule?.state ?? '',
    service: currentApplicabilityRule?.service ?? '',
    sector: currentApplicabilityRule?.sector ?? '',
    industries: getInitialIndustries(),
    listing_status: currentApplicabilityRule?.listing_status ?? 'Listed',
    location: currentApplicabilityRule?.location ?? '',
    employee_count: currentApplicabilityRule?.employee_count ?? '',
    revenue_band: currentApplicabilityRule?.revenue_band ?? '',
    id: currentApplicabilityRule?.id ?? '',
  };

  const validationSchema = object({
    name: string()
      .max(250, 'Name must be between 3 and 250 characters')
      .min(3, 'Name must be between 3 and 250 characters')
      .required('Rule Name is required'),
    sector: string().required('Sector is required'),
    listing_status: string().required('Listing Status is required'),
    state: string().notRequired(),
    service: string().notRequired(),
    industries: array().notRequired(),
    location: string().notRequired(),
    employee_count: string().notRequired(),
    revenue_band: string().notRequired(),
    description: string()
      .max(5000, 'Description must be between 3 and 5000 characters')
      .notRequired(),
  });

  const toastMessage = () => {
    switch (actionType) {
      case 'Create':
        return 'Created Applicability Rule!';
      case 'Edit':
        return 'Updated Applicability Rule!';
      default:
        return '';
    }
  };

  const toastAndCloseModal = (res: any) => {
    const { success, error } = (res?.data || {}) as {
      success: boolean;
      error?: string[];
    };
    if (success) {
      toast.success(toastMessage());
      onClose?.();
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const onSubmit = async (
    values: IFields,
    { validateForm }: FormikHelpers<IFields>,
  ) => {
    await validateForm(values);
    let res;
    const industriesArray = Array.isArray(values.industries)
      ? values.industries.map((ind) => ind.label || ind.value)
      : [];

    const params = {
      name: values.name,
      description: values.description,
      state: values.state,
      service: values.service,
      sector: values.sector,
      industries: industriesArray,
      listing_status: values.listing_status,
      location: values.location,
      employee_count: values.employee_count,
      revenue_band: values.revenue_band,
    };

    switch (actionType) {
      case 'Create':
        res = await ApplicabilityRulesService.create(params);
        toastAndCloseModal(res);
        return;
      case 'Edit':
        res = await ApplicabilityRulesService.update(
          params,
          values?.id || '',
        );
        toastAndCloseModal(res);
        return;
      default:
        return null;
    }
  };

  return (
    <div>
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
            <div style={{ background: '#fefefe' }} className="p-4 pt-0">
              {/* Name */}
              <Row>
                <Col className="mt-3" style={{ zIndex: 0 }}>
                  <FormikField
                    name="name"
                    type="text"
                    validationSchema={validationSchema}
                    label="Rule Name"
                    errors={errors as Record<string, string>}
                    autoFocus
                    placeholder="Enter Applicability Rule Name"
                    maxLength={250}
                    isCustomRequired
                  />
                </Col>
              </Row>

              {/* Sector & Industries */}
              <Row>
                <Col className="mt-3" md={6}>
                  <Field name="sector">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Sector"
                        error={errors.sector as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          options={sectorOptions}
                          name={field.name}
                          id={field.name}
                          placeholder="Select Sector"
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || '');
                          }}
                          value={
                            sectorOptions.find((opt) => opt.value === values.sector)
                            || (values.sector ? { label: values.sector, value: values.sector } : null)
                          }
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>

                <Col className="mt-3" md={6}>
                  <Field name="industries">
                    {({ field: formikField }: FieldProps<Option[]>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Industries"
                        field={formikField}
                        error={errors.industries as string}
                      >
                        <Field
                          name="industries"
                          component={IndustriesSelect}
                          id={formikField.name}
                          value={values?.industries}
                          onChange={(e: Option[]) => {
                            setFieldValue('industries', e);
                          }}
                          isMulti
                          placeholder="Select Industries"
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>

              {/* State & Location */}
              <Row>
                <Col className="mt-3" md={6}>
                  <Field name="state">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="State"
                        error={errors.state as string}
                        field={field}
                      >
                        <Field
                          component={CustomSelect}
                          options={stateOptions}
                          name={field.name}
                          id={field.name}
                          placeholder="Select State"
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || '');
                          }}
                          value={
                            stateOptions.find((opt) => opt.value === values.state)
                            || (values.state ? { label: values.state, value: values.state } : null)
                          }
                          isClearable
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>

                <Col className="mt-3" md={6}>
                  <FormikField
                    name="location"
                    type="text"
                    validationSchema={validationSchema}
                    label="Location"
                    errors={errors as Record<string, string>}
                    placeholder="e.g. Pune Industrial Area, Dahej SEZ"
                  />
                </Col>
              </Row>

              {/* Service & Listing Status */}
              <Row>
                <Col className="mt-3" md={6}>
                  <FormikField
                    name="service"
                    type="text"
                    validationSchema={validationSchema}
                    label="Service"
                    errors={errors as Record<string, string>}
                    placeholder="e.g. Statutory Audit, Labor Law"
                  />
                </Col>

                <Col className="mt-3" md={6}>
                  <Field name="listing_status">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Listing Status"
                        error={errors.listing_status as string}
                        field={field}
                        isCustomRequired
                      >
                        <Field
                          component={CustomSelect}
                          options={listingStatusOptions}
                          name={field.name}
                          id={field.name}
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || 'Listed');
                          }}
                          value={
                            listingStatusOptions.find(
                              (opt) => opt.value === values.listing_status,
                            ) || { label: values.listing_status, value: values.listing_status }
                          }
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>

              {/* Employee Count & Revenue Band */}
              <Row>
                <Col className="mt-3" md={6}>
                  <Field name="employee_count">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Employee Count"
                        error={errors.employee_count as string}
                        field={field}
                      >
                        <Field
                          component={CustomSelect}
                          options={employeeCountOptions}
                          name={field.name}
                          id={field.name}
                          placeholder="Select Employee Range"
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || '');
                          }}
                          value={
                            employeeCountOptions.find(
                              (opt) => opt.value === values.employee_count,
                            ) || (values.employee_count
                              ? { label: values.employee_count, value: values.employee_count }
                              : null)
                          }
                          isClearable
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>

                <Col className="mt-3" md={6}>
                  <Field name="revenue_band">
                    {({ field }: FieldProps<string>) => (
                      <CustomInputField
                        validationSchema={validationSchema}
                        label="Revenue Band"
                        error={errors.revenue_band as string}
                        field={field}
                      >
                        <Field
                          component={CustomSelect}
                          options={revenueBandOptions}
                          name={field.name}
                          id={field.name}
                          placeholder="Select Revenue Range"
                          onChange={(e: Option) => {
                            setFieldValue(field.name, e?.value || '');
                          }}
                          value={
                            revenueBandOptions.find(
                              (opt) => opt.value === values.revenue_band,
                            ) || (values.revenue_band
                              ? { label: values.revenue_band, value: values.revenue_band }
                              : null)
                          }
                          isClearable
                        />
                      </CustomInputField>
                    )}
                  </Field>
                </Col>
              </Row>

              {/* Description */}
              <Row>
                <Col className="mt-3">
                  <FormikField
                    as="textarea"
                    name="description"
                    type="text"
                    validationSchema={validationSchema}
                    label="Description"
                    errors={errors as Record<string, string>}
                    placeholder="Enter Rule Description"
                  />
                </Col>
              </Row>

              {/* Actions Footer */}
              <div className="d-flex justify-content-end pt-5">
                <Button
                  type="button"
                  className="btn Cancelbtn px-4 py-2"
                  onClick={() => {
                    onClose?.();
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="savebtn ms-3 px-4 py-2"
                  disabled={isSubmitting}
                >
                  {btnName(isSubmitting, actionType)}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
