/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/Button/Button';
import { FormikField } from '@/components/FormikField/FormikField';
import { IQuestionOption } from '@/lib/interface/IQuestions.interface';
import { QuestionService } from '@/lib/service';
// import { Params } from '@/lib/utils';
import { Col, Row, Stack } from 'react-bootstrap';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-hot-toast';

interface QuestionOptionsProps {
  namePrefix: string;
  options: IQuestionOption[];
  errors?: any;
  fieldError?: any;
  validationSchema?: any;
  onReorder?: (from: number, to: number) => void;
  onAddOption: () => void;
  setFieldValue: (field: string, value: any) => void;
  questionId?: string; // Add this prop to pass the question ID
  actionType: string | null; // Add this to know if we're in edit mode
}

export default function QuestionOptionsList({
  namePrefix,
  options,
  errors,
  fieldError,
  validationSchema,
  onReorder,
  onAddOption,
  setFieldValue,
  questionId,
  actionType,
}: QuestionOptionsProps) {
  const handleDelete = async (index: number) => {
    const option = options[index];

    if (actionType === 'Edit' && questionId && option?.id) {
      try {
        // Call the API to delete the option
        const params = {
          optionIds: [option.id],
          isDeleted: true,
        };

        // Call the API with the correct structure
        const response = await QuestionService.deleteQuestionsOption(
          questionId,
          params,
        );

        if (response?.data?.success) {
          const updatedOptions = options.filter((_, i) => i !== index);
          setFieldValue(namePrefix, updatedOptions);
        }
      } catch (error) {
        toast.error('Failed to delete option');
      }
    } else {
      const updatedOptions = options.filter((_, i) => i !== index);
      setFieldValue(namePrefix, updatedOptions);
    }
  };

  //   const handleDelete = async (index: number) => {
  //     const updatedOptions = options.filter((_, i) => i !== index);
  //     setFieldValue(namePrefix, updatedOptions);
  // };

  return (
    <Row className="my-3">
      <Col md={12}>
        <h6>Options</h6>
      </Col>

      <Col md={12} className="p-3 rounded">
        {options.map((option, index) => {
          // Skip rendering if option is marked as deleted
          if (option.is_deleted) return null;

          return (
            <div
              key={option?.id || `option-${index}`}
              className="p-3 my-3"
              style={{ background: '#fefefe', border: '1px solid #ccc' }}
            >
              {/* MOVE UP */}
              {index !== 0 && (
                <BsFillArrowUpCircleFill
                  className="cursor-pointer me-2"
                  onClick={() => onReorder?.(index, index - 1)}
                />
              )}

              {/* MOVE DOWN */}
              {index !== options.length - 1 && (
                <BsFillArrowDownCircleFill
                  className="cursor-pointer"
                  onClick={() => onReorder?.(index, index + 1)}
                />
              )}

              <Stack
                direction="horizontal"
                className="align-items-bottom w-100 mt-2"
              >
                <div className="w-100">
                  <FormikField
                    name={`${namePrefix}[${index}][text]`}
                    type="text"
                    validationSchema={validationSchema}
                    label={`Option Text ${index + 1}`}
                    errors={errors}
                    placeholder="Text"
                    customErrorMap={fieldError?.[index]?.text}
                    isCustomRequired
                  />
                </div>

                <div className="w-100 ms-3">
                  <FormikField
                    name={`${namePrefix}[${index}][value]`}
                    type="text"
                    validationSchema={validationSchema}
                    label={`Option Emission ${index + 1}`}
                    errors={errors}
                    placeholder="Emission Values"
                    customErrorMap={fieldError?.[index]?.value}
                  />
                </div>

                {/* DELETE BUTTON */}
                <div className="mb-2">
                  {options.filter((opt) => !opt.is_deleted).length > 2 && (
                    <Button
                      type="button"
                      className="Cancelbtn mt-3 ms-3"
                      onClick={() => handleDelete(index)}
                    >
                      <MdDelete />
                    </Button>
                  )}
                </div>
              </Stack>
            </div>
          );
        })}

        <Stack className="align-items-center mt-5">
          <Button className="Cancelbtn" onClick={onAddOption}>
            Add Option
          </Button>
        </Stack>
      </Col>
    </Row>
  );
}
