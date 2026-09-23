'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IQuestionnaire } from '@/lib/interface/IQuestionnaire.interface';
import { QuestionnaireService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditQuestionnaire from './AddorEditQuestionnaire';

export default function QuestionnaireActionDropDown({
  questionnaire,
}: {
  questionnaire: IQuestionnaire;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<IQuestionnaire>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentQuestionnaire(undefined);
  };

  const modal = useModal({
    style: {
      size: 'lg',
      title: `${actionType} Questionnaire`,
    },
    content: (
      <AddorEditQuestionnaire
        actionType={actionType}
        onClose={closeModal}
        currentQuestionnaire={currentQuestionnaire}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentQuestionnaire || !currentQuestionnaire.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await QuestionnaireService.activeQuestionnaire(
        currentQuestionnaire.id,
      );
    } else if (actionType === 'Delete') {
      response = await QuestionnaireService.deleteQuestionnaire(
        currentQuestionnaire.id,
      );
    }
    const { success, error } = (response?.data || {}) as {
      success: boolean;
      error?: string[];
    };

    if (success) {
      toast.success(`Questionnaire ${actionType}d`);
      hideModal();
      setCurrentQuestionnaire(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Questionnaire`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this questionnaire item?`}
      />
    ),
  });

  useEffect(() => {
    switch (actionType) {
      case 'Edit':
        modal();
        break;
      case 'Activate':
      case 'Delete':
        deleteOrActive();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionnaire, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {questionnaire?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentQuestionnaire(questionnaire);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentQuestionnaire(questionnaire);
              }}
            >
              Delete
            </li>
          </>
        ) : (
          <li
            aria-hidden
            className="dropdown_item px-4"
            onClick={() => {
              setActionType('Activate');
              setCurrentQuestionnaire(questionnaire);
            }}
          >
            Activate
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
