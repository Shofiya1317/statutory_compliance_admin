/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomStyles } from '@/components/CustomStyles/CustomStyles';
import { useCallback, useEffect, useState } from 'react';
import {
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from 'react-select';
import AsyncSelect from 'react-select/async';

interface SearchProps {
  limit: string;
}

export type Option = Readonly<{
  label: string;
  value: string;
  id?: number;
  data?: any;
}>;

interface SectionSelectProps {
  isMulti?: boolean;
  value?: Option | Option[];
  onChange: (option: Option | Option[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  searchParams?: SearchProps;
}

export default function SectionSelect({
  isMulti = false,
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Select Section',
  searchParams,
}: SectionSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<
    OptionsOrGroups<Option, GroupBase<Option>>
  >([]);

  const loadOptions = useCallback(
    async (
      input: string,
    ): Promise<OptionsOrGroups<Option, GroupBase<Option>>> => {
      const list = [
        { id: '1', name: 'Section A' },
        { id: '2', name: 'Section B' },
      ];

      return list
        .filter((item) =>
          item.name.toLowerCase().includes(input.toLowerCase()) || !input,
        )
        .map((item) => ({
          label: item.name,
          value: item.id,
          data: item,
        }));
    },
    [searchParams?.limit],
  );

  useEffect(() => {
    loadOptions('').then((data: unknown) => {
      setOptions(data as OptionsOrGroups<Option, GroupBase<Option>>);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newValue: MultiValue<Option> | SingleValue<Option>) => {
    if (isMulti) {
      onChange(newValue as Option[]);
    } else {
      onChange(newValue as Option);
    }
  };

  const selectValue = () => {
    if (isMulti) {
      if ((value as Option[])?.length > 0) {
        return value as Option[];
      }
      return null;
    }
    if ((value as Option)?.label) {
      return value as Option;
    }
    return null;
  };

  return (
    <AsyncSelect
      isMulti={isMulti}
      value={selectValue()}
      onChange={handleChange}
      onInputChange={(newValue: any) => {
        setInputValue(newValue);
      }}
      defaultOptions={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      loadOptions={loadOptions}
      inputValue={inputValue}
      styles={CustomStyles}
      isClearable={false}
      classNamePrefix="user-select"
    />
  );
}
