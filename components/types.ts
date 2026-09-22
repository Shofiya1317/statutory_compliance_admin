/* eslint-disable @typescript-eslint/no-explicit-any */

import { FieldInputProps } from 'formik';
import { ChangeEvent, ReactElement, ReactNode } from 'react';
import { AnyObject, AnySchema } from 'yup';
import { Params } from '../lib/utils';

export type ToastProps = Readonly<{
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'LOADING';
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  autoClose?: number;
}>;

export type ModalProps = Readonly<{
  show: boolean;
  onHide?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size: 'sm' | 'lg' | 'xl';
  fullscreen?: string | true;
  onClose?: () => void;
}>;

export type InputFieldProps = Readonly<{
  validationSchema: AnySchema<AnyObject>;
  label: string;
  type?: string;
  field: {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  isValid?: boolean;
  error?: string;
  autoFocus?: boolean;
  placeholder?: string;
  component?: ReactNode;
  disabled?: boolean;
  as?: string;
  isPassword?: boolean;
  setPasswordIcon?: (data: boolean) => void;
  passwordIcon?: boolean;
  maxLength?: number;
  rightIcon?: boolean;
  icon?: React.ReactNode;
  onBlur?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  value?: string;
  isCustomRequired?: boolean;
}>;

export type CustomInputFieldProps = Readonly<{
  validationSchema: AnySchema<AnyObject> | undefined;
  label: string;
  field: any;
  error: string | undefined;
  children: ReactNode;
  isCustomRequired?: boolean;
}>;

export type FormikTimeFieldProps = Readonly<{
  name: string;
  label: string;
  errors?: string;
  validationSchema?: AnySchema<AnyObject, any>;
  isDisabled?: boolean;
  value?: string;
  onChange?: (time: string) => void;
  use12Hours?: boolean;
}>;

export type FormikPhoneNumberProps = Readonly<{
  name: string;
  label: string;
  errors?: string;
  isDisabled?: boolean;
  validationSchema?: AnySchema<AnyObject>;
  onChange?: (phoneNumber: string) => void;
  isInternational?: boolean;
  value?: string;
  isCustomRequired?: boolean;
}>;

export type FormikFieldProps = Readonly<{
  name: string;
  errors?: Record<string, string>;
  validationSchema: AnySchema<AnyObject>;
  label: string;
  type: string;
  autoFocus?: boolean;
  placeholder?: string;
  disabled?: boolean;
  as?: string;
  isPassword?: boolean;
  setPasswordIcon?: (data: boolean) => void;
  passwordIcon?: boolean;
  maxLength?: number;
  rightIcon?: boolean;
  icon?: React.ReactNode;
  onBlur?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  value?: string;
  isCustomRequired?: boolean;
  customErrorMap?: string;
}>;

export type FormikDateFieldProps = Readonly<{
  name: string;
  label: string;
  errors?: string;
  validationSchema?: AnySchema<AnyObject>;
  minDate?: Date | string | number;
  maxDate?: Date | string | number;
  isDisabled?: boolean;
  onlyYearPicker?: boolean;
  onlyMonthPicker?: boolean;
}>;

export type CustomStylesProps = Readonly<{
  isFocused: boolean;
  isSelected: boolean;
}>;

export type Option = Readonly<{
  label: string;
  value: string;
  id?: number;
  data?: any;
}>;

export type CustomCreatableSelectProps = Readonly<{
  options: Option[];
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  callback?: (value: Option[]) => void;
  isDisabled: boolean;
  isClearable: boolean;
  field?: FieldInputProps<any> extends infer F ? F : never;
  form?: {
    setFieldValue: (name: string, value: string | string[]) => void;
  };
  displayName?: string;
  maxLength?: number;
}>;

export type CustomSelectProps = Readonly<{
  options: Option[];
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  id: string;
  callback?: (value: Option) => void;
  isDisabled: boolean;
  value?: Option | null | string;
  isClearable?: boolean;
  onFieldUpdate?: (value: Option[] | Option) => void;
  field?: any;
  form?: {
    setFieldValue: (name: string, value: string | string[]) => void;
  };
  onChange?: (value: Option[] | Option) => void;
}>;

export type AccordionProps = Readonly<{
  accordionText?: string;
  children: ReactElement;
  className?: string;
  icon?: ReactNode;
  rightHeader?: ReactNode;
}>;

export type BreadCrumbProps = Readonly<{
  title: string;
  url?: string;
  isSubTitle?: boolean;
  isTitle?: boolean;
  breadCrumb?: {
    title: string;
    url: string;
  }[];
}>;

export type ButtonProps = Readonly<{
  text: string;
  variant?: string;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDoubleClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  prefixIconChildren?: ReactNode;
  sufixIconChildren?: ReactNode;
  isDanger?: boolean;
  isSolid?: boolean;
  isSolidSecondary?: boolean;
  isLink?: boolean;
}>;

export type NavBarMenuItemsProps = Readonly<{
  url: string;
  text: string;
  subMenu?: string;
  isRadius?: boolean;
  menu?: string;
  icon?: ReactNode;
}>;

export type PillProps = Readonly<{
  pillText: string;
  pillColorClassName: string;
}>;

export type SwitchProps = Readonly<{
  toggle?: boolean;
  textOff: string;
  textOn: string;
  isSwitchDefault?: boolean;
  checked?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  label?: string;
}>;

export type IModalProps = Readonly<{
  show: boolean;
  onHide?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size: 'sm' | 'lg' | 'xl';
  fullscreen?: string | true;
  onClose?: () => void;
}>;

export type IBreadCrumbProps = Readonly<{
  breadCrumb: readonly BreadCrumbProps[];
}>;

export type ICheckboxProps = Readonly<{
  name: string;
  error: string;
  checked: boolean;
  label: string;
}>;

export type IModalStyleProps = Readonly<{
  title?: string;
  className?: string;
  size: 'sm' | 'lg' | 'xl';
  fullscreen?: string | true;
  onClose?: () => void;
  content?: ReactNode;
}>;

export type ISearchProps = Readonly<{
  params: Params;
}>;

export type CustomCheckboxProps = Readonly<{
  name: string;
  label: string;
  errors?: Record<string, string>;
  validationSchema?: AnySchema<AnyObject>;
  isDisabled?: boolean;
  type: 'checkbox' | 'radio';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}>;

export type ActionType =
  | 'Unsuspend'
  | 'Suspend'
  | 'Save'
  | 'View'
  | 'Invite'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Block'
  | 'Unblock'
  | 'Resend Invitation'
  | 'DeleteIndustry'
  | 'Activate'
  | null;

export type IQuestionType =
  | 'TEXT'
  | 'MULTI_SELECT'
  | 'SINGLE_SELECT'
  | 'NUMBER'
  | 'DATE'
  | 'FILE'
  | 'URL'
  | 'MIXED_TYPE';
