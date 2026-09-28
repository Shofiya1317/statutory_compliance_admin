'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditSection from './AddorEditSection';

export default function SectionActionDowpDown({
  section,
}: {
  section?: any;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentSection, setCurrentSection] = useState<any>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentSection(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Section`,
    },
    content: (
      <AddorEditSection
        actionType={actionType}
        onClose={closeModal}
        currentSection={currentSection}
      />
    ),
  });

  const handleConfirm = async () => {
    toast.success(`Section ${actionType}`);
    hideModal();
    setCurrentSection(undefined);
    setActionType(null);
    router.refresh();
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Section`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Section ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentSection && actionType === 'Invite') {
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
  }, [currentSection, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentSection(section);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentSection(section);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
