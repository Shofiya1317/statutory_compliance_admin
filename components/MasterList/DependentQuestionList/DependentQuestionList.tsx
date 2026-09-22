import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { Modal } from 'react-bootstrap';
import ListQuestionInModal from '../Question/ListQuestionInModal';

export default function DependentQuestionList({
  optionId,
  setOptionId,
  dependentQuestion,
  setDependentQuestion,
}: {
  optionId: string | string[] | undefined;
  setOptionId: (data: undefined) => void;
  dependentQuestion: IQuestion[] | undefined;
  setDependentQuestion: (data: IQuestion[] | undefined) => void;
}) {
  return (
    <Modal
      show={!!optionId}
      onHide={() => setOptionId(undefined)}
      centered
      size="lg"
    >
      <Modal.Header closeButton>Add Question</Modal.Header>
      <Modal.Body>
        <ListQuestionInModal
          optionId={optionId}
          dependentQuestion={dependentQuestion}
          setDependentQuestion={setDependentQuestion}
        />
      </Modal.Body>
    </Modal>
  );
}
