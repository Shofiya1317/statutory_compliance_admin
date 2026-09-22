/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */

import { getIn } from 'formik';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { CustomInputFieldProps } from '../types';

const isRequiredField = (validationSchema: any, name: string) => !!getIn(validationSchema?.describe().fields, name)?.tests?.find(
  (obj: { name: string }) => obj.name === 'required',
);

export function CustomInputField({
  validationSchema,
  label,
  field,
  error,
  children,
  isCustomRequired,
}: CustomInputFieldProps) {
  return (
    <FormGroup controlId={field?.name} className="" data-testid={label}>
      <FormLabel className="form_label">
        {label ?? ''}
        {' '}
        {(isCustomRequired || isRequiredField(validationSchema, field.name))
          && '*'}
      </FormLabel>
      <div>{children}</div>

      {error && (
        <small className="form-text text-danger form_error">{error}</small>
      )}
    </FormGroup>
  );
}
