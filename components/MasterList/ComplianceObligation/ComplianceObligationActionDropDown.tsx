'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IComplianceObligation } from '@/lib/interface/IComplianceObligation.interface';
import { ComplianceObligationService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditComplianceObligation from './AddorEditComplianceObligation';

export default function ComplianceObligationActionDropDown({
  complianceObligation,
}: {
  complianceObligation: IComplianceObligation;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentComplianceObligation, setCurrentComplianceObligation] = useState<IComplianceObligation>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentComplianceObligation(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Obligation`,
    },
    content: (
      <AddorEditComplianceObligation
        actionType={actionType}
        onClose={closeModal}
        currentComplianceObligation={currentComplianceObligation}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentComplianceObligation || !currentComplianceObligation.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await ComplianceObligationService.activeComplianceObligation(
        currentComplianceObligation.id,
      );
    } else if (actionType === 'Delete') {
      response = await ComplianceObligationService.deleteComplianceObligation(
        currentComplianceObligation.id,
      );
    }
    const { success, error } = (response?.data || {}) as {
      success: boolean;
      error?: string[];
    };

    if (success) {
      toast.success(`Compliance Obligation ${actionType}d`);
      hideModal();
      setCurrentComplianceObligation(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Obligation`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this compliance obligation?`}
      />
    ),
  });

  useEffect(() => {
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
  }, [currentComplianceObligation, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {complianceObligation?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentComplianceObligation(complianceObligation);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentComplianceObligation(complianceObligation);
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
              setCurrentComplianceObligation(complianceObligation);
            }}
          >
            Activate
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
