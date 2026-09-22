/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomStyles } from '@/components/CustomStyles/CustomStyles';
import { Option } from '@/components/types';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { QuestionService } from '@/lib/service';
import { Params } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import {
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from 'react-select';
import AsyncSelect from 'react-select/async';

interface QuestionsSelectProps {
  isMulti?: boolean;
  value?: Option | Option[];
  onChange: (option: Option | Option[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  indicator?: string;
  parentQuestionId?: string;
  questionType?: string[];
}

export default function QuestionsSelect({
  isMulti = false,
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Select Question',
  indicator,
  parentQuestionId,
  questionType,
}: QuestionsSelectProps) {
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
        question_type: questionType || ['SINGLE'],
        indicator,
      };
      const res = await QuestionService.getAll(filter as unknown as Params);
      const { questions } = res?.data as unknown as { questions: IQuestion[] };
      const newOptions = questions?.map((question: IQuestion) => ({
        label: question.title,
        value: question.id.toString(),
        data: question,
        isDisabled:
            question?.status === 'INACTIVE'
            || question?.id === parentQuestionId,
      })) || [];
      return newOptions || [];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [indicator, parentQuestionId],
  );

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    loadOptions('').then((options: any) => {
      setOptions(options as OptionsOrGroups<Option, GroupBase<Option>>);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicator, parentQuestionId]);

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
