import {
  Field, FieldProps, FormikHelpers, FormikValues,
} from 'formik';
import { ChangeEvent } from 'react';
import { CustomInputField } from '../InputField/CustomInputField';
import { CustomCheckboxProps } from '../types';

export default function CustomCheckbox({
  name,
  label,
  errors,
  validationSchema,
  isDisabled = false,
  type,
  onChange,
}: Readonly<CustomCheckboxProps>) {
  const updateValue = (
    event: ChangeEvent<HTMLInputElement>,
    form: FormikHelpers<FormikValues>,
  ) => {
    if (onChange) {
      onChange(event);
    } else {
      form.setFieldValue(name, event?.target?.checked);
    }
  };

  return (
    <Field name={name}>
      {({ field, form }: FieldProps<FormikValues>) => {
        const inputId = `customCheckbox_${name}`;
        return (
          <CustomInputField
            validationSchema={validationSchema}
            label={label}
            error={errors?.[name] ?? ''}
            field={field}
          >
            <Field
              type={type}
              checked={field?.value}
              name={field}
              id={inputId}
              data-testid={inputId}
              disabled={isDisabled}
              value={field?.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                updateValue(event, form);
              }}
            />
          </CustomInputField>
        );
      }}
    </Field>
  );
}
