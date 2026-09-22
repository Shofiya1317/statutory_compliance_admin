'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { QuestionService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddOrEditQuestion from './AddOrEditQuestion';

export default function QuestionsActionDowpDown({
  question,
}: {
  question: IQuestion;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentQuestion(undefined);
  };

  const handleConfirm = async () => {
    if (!currentQuestion || !currentQuestion.id) {
      return;
    }
    let response;
    if (actionType === 'Delete') {
      response = await QuestionService.deleteQuestion(currentQuestion.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Question ${actionType}`);
      hideModal();
      setCurrentQuestion(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Question`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Question ?`}
      />
    ),
  });

  const modal = useModal({
    style: {
      size: 'lg',
      title: `${actionType} Question`,
    },
    content: (
      <AddOrEditQuestion
        actionType="Edit"
        onClose={closeMoal}
        currentQuestion={currentQuestion}
      />
    ),
  });

  useEffect(() => {
    switch (actionType) {
      case 'Activate':
      case 'Delete':
        deleteOrActive();
        break;
      case 'Edit':
        modal();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentQuestion(question);
          }}
        >
          Edit
        </li>
        {/* <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            router.push(`/masters/questions/${question?.id}`);
          }}
        >
          View
        </li> */}
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentQuestion(question);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
