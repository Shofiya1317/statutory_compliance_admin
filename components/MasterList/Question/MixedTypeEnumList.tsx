/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { Col, Row, Stack } from 'react-bootstrap';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';

interface QuestionOptionsProps {
  namePrefix: string;
  options: { value: string }[];
  errors?: any;
  fieldError?: any;
  validationSchema?: any;
  onReorder?: (from: number, to: number) => void;
  onAddOption: () => void;
  setFieldValue: (field: string, value: any) => void;
}

export default function MixedTypeEnumList({
  namePrefix,
  options,
  errors,
  fieldError,
  validationSchema,
  onReorder,
  onAddOption,
  setFieldValue,
}: QuestionOptionsProps) {
  return (
    <Row className="my-3">
      <Col md={12}>
        <h6>Options</h6>
      </Col>
      <Col md={12} className="p-3 rounded">
        {options.map((option, optionIndex) => (
          // eslint-disable-next-line react/jsx-key
          <div
            className="p-3 my-3"
            style={{ background: '#fefefe', border: '1px solid #ccc' }}
          >
            {optionIndex !== 0 && (
              <BsFillArrowUpCircleFill
                className="cursor-pointer me-2"
                onClick={() => onReorder?.(optionIndex, optionIndex - 1)}
              />
            )}
            {optionIndex !== options.length - 1 && (
              <BsFillArrowDownCircleFill
                className="cursor-pointer"
                onClick={() => onReorder?.(optionIndex, optionIndex + 1)}
              />
            )}
            <Stack
              direction="horizontal"
              className="align-items-bottom w-100 mt-2"
            >
              <div className="w-100">
                <FormikField
                  name={`${namePrefix}[${optionIndex}][value]`}
                  type="text"
                  validationSchema={validationSchema}
                  label={`Option Text ${optionIndex + 1}`}
                  errors={errors}
                  placeholder="Text"
                  customErrorMap={fieldError?.[optionIndex]?.value}
                  isCustomRequired
                />
              </div>
              <div className="mb-2">
                {options?.length > 2 && (
                  <Button
                    type="button"
                    className="Cancelbtn mt-3 ms-3"
                    onClick={() => {
                      const updated = [...options];
                      updated.splice(optionIndex, 1);
                      setFieldValue(namePrefix, updated);
                    }}
                  >
                    <MdDelete />
                  </Button>
                )}
              </div>
            </Stack>
          </div>
        ))}
        <Stack className="align-items-center mt-5">
          <Button className="Cancelbtn" onClick={onAddOption}>
            Add Option
          </Button>
        </Stack>
      </Col>
    </Row>
  );
}
