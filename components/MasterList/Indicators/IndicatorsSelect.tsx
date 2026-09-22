import { CustomStyles } from '@/components/CustomStyles/CustomStyles';
import { Option } from '@/components/types';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IndicatorsService } from '@/lib/service';
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

interface IndicatorsSelectProps {
  isMulti?: boolean;
  value?: Option | Option[];
  onChange: (option: Option | Option[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  module?: string;
  searchParams?: SearchProps;
}

export default function IndicatorsSelect({
  isMulti = false,
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Select Indicator',
  module,
  searchParams,
}: IndicatorsSelectProps) {
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
        module,
        limit: searchParams?.limit || '50',
      };
      const res = await IndicatorsService.getAll(filter);
      const { indicators } = res?.data as unknown as {
        indicators: IIndicator[];
      };
      const newOptions = indicators?.map((indicator: IIndicator) => ({
        label: indicator.name,
        value: indicator.id.toString(),
        isDisabled: indicator?.is_deleted,
      })) || [];
      return newOptions || [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module],
  );

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    loadOptions('').then((options: unknown) => {
      setOptions(options as OptionsOrGroups<Option, GroupBase<Option>>);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

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
