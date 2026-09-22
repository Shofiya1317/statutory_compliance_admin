'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IStandard } from '@/lib/interface/IStandard.interface';
import { StandardService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function StandardsActionDowpDown({
  standard,
}: {
  standard: IStandard;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentStandard, setCurrentStandard] = useState<IStandard>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentStandard(undefined);
  };

  const handleConfirm = async () => {
    if (!currentStandard || !currentStandard.id) {
      return;
    }
    let response;
    if (actionType === 'Delete') {
      response = await StandardService.deleteStandards(currentStandard.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Standard ${actionType}`);
      hideModal();
      setCurrentStandard(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Standard`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Standard ?`}
      />
    ),
  });

  useEffect(() => {
    switch (actionType) {
      case 'Activate':
      case 'Delete':
        deleteOrActive();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStandard, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4 curser-pointer"
          onClick={() => {
            router.push(`/masters/standards/${standard?.id}/view`);
          }}
        >
          View
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4 curser-pointer"
          onClick={() => {
            router.push(`/masters/standards/${standard?.id}/edit`);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4 curser-pointer"
          onClick={() => {
            setActionType('Delete');
            setCurrentStandard(standard);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
