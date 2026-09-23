'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IComplianceScope } from '@/lib/interface/IComplianceScope.interface';
import { ComplianceScopeService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditComplianceScope from './AddorEditComplianceScope';

export default function ComplianceScopeActionDropDown({
  complianceScope,
}: {
  complianceScope: IComplianceScope;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentComplianceScope, setCurrentComplianceScope] = useState<IComplianceScope>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentComplianceScope(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Scope`,
    },
    content: (
      <AddorEditComplianceScope
        actionType={actionType}
        onClose={closeModal}
        currentComplianceScope={currentComplianceScope}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentComplianceScope || !currentComplianceScope.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await ComplianceScopeService.activeComplianceScope(
        currentComplianceScope.id,
      );
    } else if (actionType === 'Delete') {
      response = await ComplianceScopeService.deleteComplianceScope(
        currentComplianceScope.id,
      );
    }
    const { success, error } = (response?.data || {}) as {
      success: boolean;
      error?: string[];
    };

    if (success) {
      toast.success(`Compliance Scope ${actionType}d`);
      hideModal();
      setCurrentComplianceScope(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Scope`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this compliance scope?`}
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
  }, [currentComplianceScope, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {complianceScope?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentComplianceScope(complianceScope);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentComplianceScope(complianceScope);
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
              setCurrentComplianceScope(complianceScope);
            }}
          >
            Activate
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
