'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IndicatorsService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditIndicators from './AddorEditIndicators';

export default function IndicatorsActionDowpDown({
  indicator,
}: {
  indicator: IIndicator;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentIndicator, setCurrentIndicator] = useState<IIndicator>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentIndicator(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Indicator`,
    },
    content: (
      <AddorEditIndicators
        actionType={actionType}
        onClose={closeMoal}
        currentIndicator={currentIndicator}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentIndicator || !currentIndicator.id) {
      return;
    }
    let response;
    if (actionType === 'Delete') {
      response = await IndicatorsService.deleteindicators(currentIndicator.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Indicator ${actionType}`);
      hideModal();
      setCurrentIndicator(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Indicator`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Indicator ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentIndicator && actionType === 'Invite') {
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
  }, [currentIndicator, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Edit');
            setCurrentIndicator(indicator);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4"
          onClick={() => {
            setActionType('Delete');
            setCurrentIndicator(indicator);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
