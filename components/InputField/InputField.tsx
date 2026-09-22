/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */

import { getIn } from 'formik';
import {
  FormControl, FormGroup, FormLabel, InputGroup,
} from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { InputFieldProps } from '../types';
import './inputField.css';

const isRequiredField = (validationSchema: any, name: string) => !!getIn(validationSchema.describe().fields, name)?.tests?.find(
  (obj: { name: string }) => obj.name === 'required',
);

export function InputField({
  validationSchema,
  label,
  type = 'text',
  field,
  isValid,
  autoFocus,
  error,
  placeholder,
  disabled = false,
  isPassword,
  setPasswordIcon,
  passwordIcon,
  maxLength,
  rightIcon,
  icon,
  onBlur,
  as = 'input',
  onChange,
  unit,
  value,
  isCustomRequired,
}: InputFieldProps) {
  return (
    <FormGroup controlId={field.name} className=" position-relative">
      <FormLabel className="form_label">
        {label}
        {' '}
        {(isCustomRequired || isRequiredField(validationSchema, field.name))
          && '*'}
      </FormLabel>
      <FormControl
        type={type}
        as={as as any}
        autoFocus={!!autoFocus}
        value={value ?? field.value}
        onChange={onChange || field.onChange}
        isInvalid={!isValid}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="none"
        onBlur={onBlur}
        onFocus={onBlur}
        onWheel={(e) => {
          if (e?.target instanceof HTMLInputElement) {
            e.target.blur();
          }
        }}
      />
      {isPassword
        && (passwordIcon ? (
          <span
            aria-hidden="true"
            className="icon-css"
            data-testid="password-eye-icon"
            onClick={() => {
              if (setPasswordIcon) {
                setPasswordIcon(!passwordIcon);
              }
            }}
          >
            <AiFillEye color="var(--textLight)" />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="icon-css"
            data-testid="password-eye-invisible-icon"
            onClick={() => {
              if (setPasswordIcon) {
                setPasswordIcon(!passwordIcon);
              }
            }}
          >
            <AiFillEyeInvisible color="var(--textLight)" />
          </span>
        ))}
      {unit && <InputGroup.Text className="unit-css">{unit}</InputGroup.Text>}
      {rightIcon && <span className="icon-css">{icon}</span>}
      {error && (
        <small className="form-text text-danger form_error">{error}</small>
      )}
    </FormGroup>
  );
}
