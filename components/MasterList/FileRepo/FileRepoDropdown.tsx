'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IFileRepo } from '@/lib/interface/IFileRepo.interface';
import AddOrEditFileRepo from './AddOrEditFileRepo';

export default function FileRepoDropdown({
  fileRepo,
}: {
  fileRepo?: IFileRepo;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentFileRepo, setCurrentFileRepo] = useState<IFileRepo>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentFileRepo(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} File Repository`,
    },
    content: <AddOrEditFileRepo actionType={actionType} onClose={closeMoal} />,
  });

  const handleConfirm = async () => {
    if (!currentFileRepo || !currentFileRepo.id) return;
    // TODO: Implement delete API
    toast.success(`File Repository ${actionType}`);
    hideModal();
    setCurrentFileRepo(undefined);
    setActionType(null);
    router.refresh();
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} File Repository`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this file repository?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentFileRepo && actionType === 'Invite') {
      modal();
    }

    switch (actionType) {
      case 'Edit':
        modal();
        break;
      case 'Delete':
        deleteOrActive();
        break;
      default:
        break;
    }
  }, [currentFileRepo, modal, deleteOrActive, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentFileRepo(fileRepo);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentFileRepo(fileRepo);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
