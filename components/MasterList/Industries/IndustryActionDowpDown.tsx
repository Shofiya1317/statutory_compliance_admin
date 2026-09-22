'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IIndustries } from '@/lib/interface/IIndustries.interface';
import { IndustryService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditIndusties from './AddorEditIndusties';

export default function IndustryActionDowpDown({
  industry,
}: {
  industry: IIndustries;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentIndustry, setCurrentIndustry] = useState<IIndustries>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentIndustry(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Industry`,
    },
    content: (
      <AddorEditIndusties
        actionType={actionType}
        onClose={closeMoal}
        currentIndustry={currentIndustry}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentIndustry || !currentIndustry.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await IndustryService.activeIndustry(currentIndustry.id);
    } else if (actionType === 'Delete') {
      response = await IndustryService.deleteIndustry(currentIndustry.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Industry ${actionType}`);
      hideModal();
      setCurrentIndustry(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Industry`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this industry ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentIndustry && actionType === 'Invite') {
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
  }, [currentIndustry, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {industry?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentIndustry(industry);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentIndustry(industry);
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
              setCurrentIndustry(industry);
            }}
          >
            Active Industry
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
