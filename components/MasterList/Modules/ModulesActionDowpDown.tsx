'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { ThemeService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditModules from './AddorEditModules';

export default function ModulesActionDowpDown({
  theme,
}: {
  theme?: IThemes;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentTheme, setCurrentTheme] = useState<IThemes>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentTheme(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Module`,
    },
    content: (
      <AddorEditModules
        actionType={actionType}
        onClose={closeMoal}
        currentModule={currentTheme}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentTheme || !currentTheme.id) {
      return;
    }
    let response;
    if (actionType === 'Delete') {
      response = await ThemeService.deletemodule(currentTheme.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Module ${actionType}`);
      hideModal();
      setCurrentTheme(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Module`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Module ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentTheme && actionType === 'Invite') {
      modal();
    }
    switch (actionType) {
      case 'Edit':
        modal();
        break;
      case 'DeleteIndustry':
        break;
      case 'Activate':
      case 'Delete':
        deleteOrActive();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentTheme(theme);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentTheme(theme);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
