'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditAct from './AddorEditAct';

export default function ActActionDowpDown({
  act,
}: {
  act?: any;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentAct, setCurrentAct] = useState<any>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentAct(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Act`,
    },
    content: (
      <AddorEditAct
        actionType={actionType}
        onClose={closeModal}
        currentAct={currentAct}
      />
    ),
  });

  const handleConfirm = async () => {
    toast.success(`Act ${actionType}`);
    hideModal();
    setCurrentAct(undefined);
    setActionType(null);
    router.refresh();
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Act`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Act ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentAct && actionType === 'Invite') {
      modal();
    }
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
  }, [currentAct, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentAct(act);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentAct(act);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
