'use client';

import { IAccount } from '@/lib/interface/IAccount.interface';
import { IUser } from '@/lib/interface/IUser.interface';
import { AccountService } from '@/lib/service';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditAccount from '../AddorEditAccount/AddorEditAccount';
import BlockOrUnblockOrDelete from '../BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '../Dropdown/DropDown';
import { useModal } from '../Modal/Context';
import { ActionType } from '../types';

export const getActionMessage = (actionType: ActionType) => {
  if (actionType === 'Block') {
    return 'block this account';
  }
  if (actionType === 'Unblock') {
    return 'unblock this account';
  }
  if (actionType === 'Suspend') {
    return 'suspend this account';
  }
  if (actionType === 'Unsuspend') {
    return 'unsuspend this account';
  }
  return 'delete this account';
};

export default function ActionDropDown({
  account,
  data,
}: {
  account: IAccount;
  data: Session | null;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentAccount, setCurrentAccount] = useState<IAccount>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentAccount(undefined);
  };

  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} User`,
    },
    content: (
      <AddorEditAccount
        actionType={actionType}
        onClose={closeMoal}
        currentAcction={currentAccount}
      />
    ),
  });

  const toastMessage = () => {
    if (actionType === 'Activate') {
      return 'Activated!';
    }
    if (actionType === 'Block') {
      return 'Blocked!';
    }
    if (actionType === 'Unblock') {
      return 'Unblocked!';
    }
    if (actionType === 'Suspend') {
      return 'Suspended!';
    }
    if (actionType === 'Unsuspend') {
      return 'Unsuspended!';
    }
    if (actionType === 'Delete') {
      return 'Deleted!';
    }
    return actionType;
  };

  const handleConfirm = async (reason?: string) => {
    if (!currentAccount || !currentAccount.id) {
      return;
    }
    let response;
    if (actionType === 'Block' && reason) {
      response = await AccountService.blockAccount(currentAccount?.id, {
        reason,
      });
    } else if (actionType === 'Unblock') {
      response = await AccountService.unBlockAccount(currentAccount.id);
    } else if (actionType === 'Suspend' && reason) {
      response = await AccountService.suspendAccount(currentAccount.id, {
        reason,
      });
    } else if (actionType === 'Unsuspend') {
      response = await AccountService.unSuspendAccount(currentAccount.id);
    } else if (actionType === 'Delete' && reason) {
      response = await AccountService.deleteAccount(currentAccount.id, {
        reason,
      });
    } else if (actionType === 'Activate') {
      response = await AccountService.reActivateAccount(currentAccount.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`Account ${toastMessage()}`);
      hideModal();
      setCurrentAccount(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const blockOrUnblockOrDeleteModal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} account`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${getActionMessage(actionType)} this account ?`}
      />
    ),
  });

  useEffect(() => {
    switch (actionType) {
      case 'Resend Invitation':
        modal();
        break;
      case 'Block':
      case 'Suspend':
      case 'Unsuspend':
      case 'Unblock':
      case 'Delete':
      case 'Activate':
        blockOrUnblockOrDeleteModal();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, actionType]);

  // eslint-disable-next-line react/no-unstable-nested-components
  function ReRenderComponents() {
    switch (account?.status) {
      case 'PENDING':
        return (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Resend Invitation');
                setCurrentAccount(account);
              }}
            >
              Resend Invitation
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentAccount(account);
              }}
            >
              Delete
            </li>
          </>
        );
      case 'SUSPEND':
        return (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Unsuspend');
                setCurrentAccount(account);
              }}
            >
              Unsuspend
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentAccount(account);
              }}
            >
              Delete
            </li>
          </>
        );
      case 'BLOCK':
        return (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentAccount(account);
              }}
            >
              Delete
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Unblock');
                setCurrentAccount(account);
              }}
            >
              Unblock
            </li>
          </>
        );
      case 'ACTIVE':
        return (
          <>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Suspend');
                setCurrentAccount(account);
              }}
            >
              Suspend
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Block');
                setCurrentAccount(account);
              }}
            >
              Block
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                setActionType('Delete');
                setCurrentAccount(account);
              }}
            >
              Delete
            </li>
            <li
              aria-hidden
              className="dropdown_item px-4"
              onClick={() => {
                router.push(`/accounts/${account?.id}/role_access`);
              }}
            >
              Role Access
            </li>
          </>
        );
      case 'DELETED':
        return (
          <li
            aria-hidden
            className="dropdown_item px-4"
            onClick={() => {
              setActionType('Activate');
              setCurrentAccount(account);
            }}
          >
            Re Active
          </li>
        );
      default:
        break;
    }
  }

  return ['SUPERADMIN', 'ADMIN']?.includes(
    (data?.user as IUser)?.role?.name,
  ) ? (
    <Dropdown>
      <ul className="dropdown_section row">{ReRenderComponents()}</ul>
    </Dropdown>
    ) : (
      <div>-</div>
    );
}
