'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditCategory from './AddorEditCategory';

export default function CategoryActionDowpDown({
  category,
}: {
  category?: any;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentCategory, setCurrentCategory] = useState<any>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentCategory(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Category`,
    },
    content: (
      <AddorEditCategory
        actionType={actionType}
        onClose={closeModal}
        currentCategory={currentCategory}
      />
    ),
  });

  const handleConfirm = async () => {
    toast.success(`Category ${actionType}`);
    hideModal();
    setCurrentCategory(undefined);
    setActionType(null);
    router.refresh();
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Category`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Category ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentCategory && actionType === 'Invite') {
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
  }, [currentCategory, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentCategory(category);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentCategory(category);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
