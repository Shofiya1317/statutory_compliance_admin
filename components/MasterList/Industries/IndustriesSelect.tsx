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

  const fallbackIndustries: Option[] = [
    { label: 'Chemicals', value: 'Chemicals' },
    { label: 'Heavy Engineering', value: 'Heavy Engineering' },
    { label: 'Specialty Chemicals', value: 'Specialty Chemicals' },
    { label: 'Petroleum Refining', value: 'Petroleum Refining' },
    { label: 'Construction', value: 'Construction' },
    { label: 'Real Estate', value: 'Real Estate' },
    { label: 'Software Services', value: 'Software Services' },
    { label: 'BPO/KPO', value: 'BPO/KPO' },
    { label: 'Pharmaceuticals', value: 'Pharmaceuticals' },
    { label: 'Automobile & Auto Components', value: 'Automobile & Auto Components' },
    { label: 'Banking & Financial Services', value: 'Banking & Financial Services' },
    { label: 'Textiles & Apparel', value: 'Textiles & Apparel' },
    { label: 'Food Processing', value: 'Food Processing' },
    { label: 'Mining & Metals', value: 'Mining & Metals' },
    { label: 'Power & Renewable Energy', value: 'Power & Renewable Energy' },
    { label: 'Logistics & Supply Chain', value: 'Logistics & Supply Chain' },
  ];

  const loadOptions = useCallback(
    async (
      input: string,
    ): Promise<OptionsOrGroups<Option, GroupBase<Option>>> => {
      try {
        const filter = { search: input, limit: searchParams?.limit || '50' };
        const res = await IndustryService.getAll(filter);
        const { industries } = (res?.data || {}) as {
          industries: IIndustries[];
        };

        const newOptions = industries
          ?.filter((industry) => industry.status !== 'INACTIVE') // ✅ remove inactive
          .map((industry) => ({
            label: industry.name,
            value: industry.name || industry.id.toString(),
          })) || [];

        if (newOptions.length > 0) {
          return newOptions;
        }
      } catch (err) {
        // fallback if API is not available or returns error
      }

      return fallbackIndustries.filter((item) =>
        item.label.toLowerCase().includes((input || '').toLowerCase()),
      );
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
