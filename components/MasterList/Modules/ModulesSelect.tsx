/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomStyles } from '@/components/CustomStyles/CustomStyles';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { StandardService } from '@/lib/service';
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
  data?: IThemes;
}>;

interface ModulesSelectProps {
  isMulti?: boolean;
  value?: Option | Option[];
  onChange: (option: Option | Option[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  searchParams?: SearchProps;
}

export default function ModulesSelect({
  isMulti = false,
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Select Theme',
  searchParams,
}: ModulesSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<
    OptionsOrGroups<Option, GroupBase<Option>>
  >([]);

  const loadOptions = useCallback(
    async (
      input: string,
    ): Promise<OptionsOrGroups<Option, GroupBase<Option>>> => {
      const filter = {
        search: input,
        limit: searchParams?.limit || '50',
      };

      const res = await StandardService.getStandardThemesList(filter);

      const modules = res?.data?.data?.map((module: any) => ({
        label: `${module.name} - ${module.standard?.name ?? ''}`,
        value: module.id,
        isDisabled: module.is_deleted,
        data: module,
      })) ?? [];

      return modules;
    },
    [searchParams?.limit],
  );

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    loadOptions('').then((options: unknown) => {
      setOptions(options as OptionsOrGroups<Option, GroupBase<Option>>);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
