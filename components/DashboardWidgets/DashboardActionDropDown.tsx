/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */

'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IndicatorsService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddOrEditDashboardWidgets from './AddOrEditDashboardWidgets';

export default function DashboardActionDropDown({
  widget,
  token,
}: {
  widget: any;
  token?: string;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentWidget, setCurrentWidget] = useState<any>();
  const [widgetId, setWidgetId] = useState<string>('');
  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentWidget(undefined);
  };
  const modal = useModal({
    style: {
      size: 'lg',
      title: `${actionType} Dashboard Widget Block`,
    },
    content: (
      <AddOrEditDashboardWidgets
        actionType={actionType}
        onClose={closeMoal}
        currentWidget={currentWidget}
        widgetId={widgetId}
        token={token}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentWidget || !currentWidget.id) {
      return;
    }
    let response;
    if (actionType === 'Delete') {
      response = await IndicatorsService.deleteindicators(currentWidget.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Dashboard Widget Block ${actionType}`);
      hideModal();
      setCurrentWidget(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Dashboard Widget Block`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this Dashboard Widget Block ?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentWidget && actionType === 'Invite') {
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
  }, [currentWidget, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        <li
          aria-hidden
          className="dropdown_item px-4 curser-pointer"
          onClick={() => {
            setActionType('Edit');
            setCurrentWidget(widget);
            setWidgetId(widget.id);
          }}
        >
          Edit
        </li>
        <li
          aria-hidden
          className="dropdown_item px-4 curser-pointer"
          onClick={() => {
            setActionType('Delete');
            setCurrentWidget(widget);
          }}
        >
          Delete
        </li>
      </ul>
    </Dropdown>
  );
}
