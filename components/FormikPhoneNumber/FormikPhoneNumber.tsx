import {
  Field, FieldInputProps, FieldProps, FormikValues,
} from 'formik';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CustomInputField } from '../InputField/CustomInputField';
import { FormikPhoneNumberProps } from '../types';
import './FormikPhoneNumber.css';

export function formatValue(
  value: string | undefined,
  fieldValue: FieldInputProps<FormikValues>,
): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }
  if (
    fieldValue?.value
    && (typeof fieldValue?.value === 'string'
      || typeof fieldValue?.value === 'number')
  ) {
    return `${fieldValue?.value}`;
  }
  if (fieldValue?.value) {
    return JSON.stringify(fieldValue?.value);
  }
  return '';
}
export function FormikPhoneNumber({
  name,
  label,
  errors,
  validationSchema,
  isDisabled,
  onChange,
  isInternational = true,
  value,
  isCustomRequired,
}: FormikPhoneNumberProps) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<FormikValues>) => (
        <CustomInputField
          validationSchema={validationSchema}
          label={label}
          error={errors}
          field={field}
          isCustomRequired={isCustomRequired}
        >
          <PhoneInput
            disabled={isDisabled}
            defaultCountry="IN"
            placeholder="Enter phone number"
            name={field.name}
            international={isInternational}
            className="form-control autocomplete"
            countryCallingCodeEditable={false}
            value={formatValue(value, field)}
            onChange={(phoneNumber) => {
              if (phoneNumber?.length) {
                if (!isValidPhoneNumber(phoneNumber)) {
                  return form.setFieldError(name, 'Invalid Phone Number');
                }
                form.setFieldError(name, '');
                if (onChange) {
                  return onChange(phoneNumber);
                }
                return form.setFieldValue(name, phoneNumber);
              }
              return form.setFieldError(name, 'Invalid Phone Number');
            }}
          />
        </CustomInputField>
      )}
    </Field>
  );
}
