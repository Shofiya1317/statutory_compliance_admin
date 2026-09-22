import { FieldInputProps } from 'formik';
import Select from 'react-select';
import { CustomStyles } from '../CustomStyles/CustomStyles';
import { CustomSelectProps, Option } from '../types';

export const getValue = (
  options: Option[] | undefined,
  isMulti: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldInputProps<any> | undefined,
  value: Option | null | undefined | string,
): Option | Option[] | undefined | null | string => {
  if (!options) {
    return isMulti ? [] : null;
  }

  if (!field?.value) {
    if (isMulti) {
      return (
        options.filter((option) => (Array.isArray(value)
          ? (value as Option[]).some(
            (val) => val.value === option.value || val.label === option.label,
          )
          : false)) || ''
      );
    }
    return (
      options.find((option) => (typeof value === 'object'
        ? option?.value === value?.value || option?.label === value?.label
        : option?.value === value || option?.label === value)) || ''
    );
  }

  if (isMulti) {
    return (
      options.filter((option) => field.value?.some(
        (val: string) => val === option.value || val === option.label,
      )) || ''
    );
  }
  return (
    options.find(
      (option) => option?.value === field.value
        || (typeof value === 'object' && option?.label === value?.label)
        || (typeof value === 'string' && option?.label === value),
    ) || ''
  );
};

function CustomSelect({
  className = '',
  placeholder = 'Select...',
  field,
  form,
  id,
  isDisabled,
  options,
  isMulti = false,
  value,
  isClearable = true,
  onFieldUpdate,
  onChange,
}: CustomSelectProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (option: any) => {
    if (onChange) {
      onChange(option); // ✅ if onChange is passed directly
    } else if (onFieldUpdate) {
      onFieldUpdate(option); // ✅ fallback
    } else {
      form?.setFieldValue(
        field?.name ?? '',
        isMulti
          ? (option as Option[])?.map((item) => item?.value)
          : (option as Option)?.value,
      );
    }
  };

  return (
    <Select
      className={className}
      name={field?.name}
      id={id}
      value={getValue(options, isMulti, field, value)}
      onChange={handleChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isDisabled={isDisabled}
      isClearable={isClearable}
      styles={CustomStyles}
      data-testid="customSelect"
      inputId={field?.name}
      classNamePrefix="user-select"
    />
  );
}

export default CustomSelect;
