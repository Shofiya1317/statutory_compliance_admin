'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IThemesIndustries } from '@/lib/interface/IThemesIndustries.interface';
import { ThemeIndustriesService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddOrEditThemesIndustries from './AddOrEditThemesIndustries';
// eslint-disable-next-line max-len
export default function ThemesIndustriesDropDown({
  themeIndustry,
}: {
  themeIndustry?: IThemesIndustries;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentTheme, setCurrentTheme] = useState<IThemesIndustries>();

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
      <AddOrEditThemesIndustries
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
      response = await ThemeIndustriesService.deleteThemeIndustry(currentTheme.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Theme-Industry ${actionType}`);
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
      title: `${actionType} Theme-Industry`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Theme-Industry ?`}
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
            setCurrentTheme(themeIndustry);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentTheme(themeIndustry);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
