'use client';

import BlockOrUnblockOrDelete from '@/components/BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '@/components/Dropdown/DropDown';
import { useModal } from '@/components/Modal/Context';
import { ActionType } from '@/components/types';
import { IApplicabilityRules } from '@/lib/interface/IApplicabilityRules.interface';
import { ApplicabilityRulesService } from '@/lib/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditApplicabilityRules from './AddorEditApplicabilityRules';

export default function ApplicabilityRulesActionDropDown({
  applicabilityRule,
}: {
  applicabilityRule: IApplicabilityRules;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentRule, setCurrentRule] = useState<IApplicabilityRules>();

  const hideModal = useModal({});
  const closeModal = () => {
    hideModal();
    setActionType(null);
    setCurrentRule(undefined);
  };

  const modal = useModal({
    style: {
      size: 'lg',
      title: `${actionType} Applicability Rule`,
    },
    content: (
      <AddorEditApplicabilityRules
        actionType={actionType}
        onClose={closeModal}
        currentApplicabilityRule={currentRule}
      />
    ),
  });

  const handleConfirm = async () => {
    if (!currentRule || !currentRule.id) {
      return;
    }
    let response;
    if (actionType === 'Activate') {
      response = await ApplicabilityRulesService.activeApplicabilityRule(
        currentRule.id,
      );
    } else if (actionType === 'Delete') {
      response = await ApplicabilityRulesService.deleteApplicabilityRule(
        currentRule.id,
      );
    }
    const { success, error } = (response?.data || {}) as {
      success: boolean;
      error?: string[];
    };

    if (success) {
      toast.success(`Applicability Rule ${actionType}d`);
      hideModal();
      setCurrentRule(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error?.[0] || 'Something went wrong');
    }
  };

  const deleteOrActive = useModal({
    style: {
      size: 'sm',
      title: `${actionType} Applicability Rule`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeModal}
        deleteText={`Are you sure you want to ${actionType?.toLocaleLowerCase()} this applicability rule?`}
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
  }, [currentRule, actionType]);

  return (
    <Dropdown>
      <ul className="dropdown_section row">
        {applicabilityRule?.status !== 'INACTIVE' ? (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Edit');
                setCurrentRule(applicabilityRule);
              }}
            >
              Edit
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentRule(applicabilityRule);
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
              setCurrentRule(applicabilityRule);
            }}
          >
            Activate
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
