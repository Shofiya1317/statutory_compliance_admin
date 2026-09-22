'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { ISector } from '@/lib/interface/ISector.interface';
import { SectorService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditSector from './AddorEditSector';

export default function SectorActionDowpDown({ sector }: { sector: ISector }) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentSector, setCurrentSector] = useState<ISector>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentSector(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Sector`,
    },
    content: (
      <AddorEditSector
        actionType={actionType}
        onClose={closeMoal}
        currentSector={currentSector}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentSector || !currentSector.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await SectorService.activeSector(currentSector.id);
    } else if (actionType === 'Delete') {
      response = await SectorService.deleteSector(currentSector.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Sector ${actionType}`);
      hideModal();
      setCurrentSector(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Sector`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this sector ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentSector && actionType === 'Invite') {
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
  }, [currentSector, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {sector?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentSector(sector);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentSector(sector);
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
              setCurrentSector(sector);
            }}
          >
            Active Sector
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
