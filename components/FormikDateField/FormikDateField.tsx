/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field, FieldProps, FormikValues } from 'formik';
import moment from 'moment';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { CustomInputField } from '../InputField/CustomInputField';
import { FormikDateFieldProps } from '../types';
import './FormikDateField.css';

export const formatDate = (
  date: any,
  onlyMonthPicker: boolean,
  onlyYearPicker: boolean,
) => {
  if (onlyMonthPicker) {
    return moment(date).format('MMMM');
  }
  if (onlyYearPicker) {
    return moment(date).format('YYYY');
  }
  return moment(date).format('YYYY-MM-DD');
};

export const getValue = (onlyMonthPicker: boolean, name: string) => {
  const fieldValue = name;
  if (fieldValue) {
    if (onlyMonthPicker) {
      return moment(new Date(fieldValue), 'YYYY-MM').format('MMMM');
    }
    return moment(new Date(fieldValue)).format('DD/MM/YYYY');
  }

  return '';
};

export const format = (onlyYearPicker: boolean, onlyMonthPicker: boolean) => {
  let formatValue;
  if (onlyYearPicker) {
    formatValue = 'YYYY';
  } else if (onlyMonthPicker) {
    formatValue = 'MMMM';
  } else {
    formatValue = 'DD-MM-YYYY';
  }
  return formatValue;
};

export default function FormikDateField({
  name,
  label,
  errors,
  validationSchema,
  minDate,
  maxDate,
  isDisabled,
  onlyYearPicker = false,
  onlyMonthPicker = false,
}: Readonly<FormikDateFieldProps>) {
  const inputId = `formikDateField_${name}`;

  return (
    <Field name={name} data-testid={`${label}_field`}>
      {({ field, form }: FieldProps<FormikValues>) => (
        <CustomInputField
          validationSchema={validationSchema}
          label={label}
          error={errors}
          field={field}
        >
          <div className="position-relative" data-testid={inputId}>
            <DatePicker
              plugins={[<DatePanel key="datePanel" header="Selected Dates" />]}
              editable={false}
              name={name}
              value={getValue(onlyMonthPicker, form.values[name])}
              className="form-control"
              disabled={isDisabled}
              format={format(onlyYearPicker, onlyMonthPicker)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(date: any) => {
                const formattedDate = formatDate(
                  date,
                  onlyMonthPicker,
                  onlyYearPicker,
                );
                form.setFieldValue(name, formattedDate);
              }}
              minDate={minDate}
              maxDate={maxDate}
              onlyMonthPicker={onlyMonthPicker}
              onlyYearPicker={onlyYearPicker}
              data-testid={inputId}
              id={inputId}
            />
            {/* <span className="calender_icon">
                <img src={dateIcon} alt="dateIcon" />
              </span> */}
          </div>
        </CustomInputField>
      )}
    </Field>
  );
}
