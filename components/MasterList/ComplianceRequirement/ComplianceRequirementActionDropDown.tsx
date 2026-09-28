'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IComplianceRequirement } from '@/lib/interface/IComplianceRequirement.interface';
import { ComplianceRequirementService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditComplianceRequirement from './AddorEditComplianceRequirement';

export default function ComplianceRequirementActionDropDown({
  complianceRequirement,
}: {
  complianceRequirement: IComplianceRequirement;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentComplianceRequirement, setCurrentComplianceRequirement] = useState<IComplianceRequirement>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentComplianceRequirement(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Requirement`,
    },
    content: (
      <AddorEditComplianceRequirement
        actionType={actionType}
        onClose={closeModal}
        currentComplianceRequirement={currentComplianceRequirement}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentComplianceRequirement || !currentComplianceRequirement.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await ComplianceRequirementService.activeComplianceRequirement(
        currentComplianceRequirement.id,
      );
    } else if (actionType === 'Delete') {
      response = await ComplianceRequirementService.deleteComplianceRequirement(
        currentComplianceRequirement.id,
      );
    }
    const { success, error } = (response?.data || {}) as {
      success: boolean;
      error?: string[];
    };

    if (success) {
      toast.success(`Compliance Requirement ${actionType}d`);
      hideModal();
      setCurrentComplianceRequirement(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Compliance Requirement`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this compliance requirement?`}
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
  }, [currentComplianceRequirement, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {complianceRequirement?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentComplianceRequirement(complianceRequirement);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentComplianceRequirement(complianceRequirement);
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
              setCurrentComplianceRequirement(complianceRequirement);
            }}
          >
            Activate
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
