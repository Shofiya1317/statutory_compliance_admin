/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomStyles } from '@/components/CustomStyles/CustomStyles';
import { Option } from '@/components/types';
import { IIndustries } from '@/lib/interface/IIndustries.interface';
import { IndustryService } from '@/lib/service';
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

interface IndustriesSelectProps {
  isMulti?: boolean;
  value?: Option | Option[];
  onChange: (option: Option | Option[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  searchParams?: SearchProps;
}

export default function IndustriesSelect({
  isMulti = false,
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Select Industries',
  searchParams,
}: IndustriesSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<
    OptionsOrGroups<Option, GroupBase<Option>>
  >([]);

  const loadOptions = useCallback(
    async (
      input: string,
    ): Promise<OptionsOrGroups<Option, GroupBase<Option>>> => {
      const filter = { search: input, limit: searchParams?.limit || '50' };
      const res = await IndustryService.getAll(filter);
      const { industries } = res?.data as {
      industries: IIndustries[];
    };

      const newOptions = industries
        ?.filter((industry) => industry.status !== 'INACTIVE') // ✅ remove inactive
        .map((industry) => ({
          label: industry.name,
          value: industry.id.toString(),
        })) || [];

      return newOptions;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    loadOptions('').then((options: any) => {
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

  return (
    <AsyncSelect
      isMulti={isMulti}
      value={value}
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
