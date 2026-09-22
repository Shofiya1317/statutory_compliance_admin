'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddorEditUser from '../AddorEditUser/AddorEditUser';
import BlockOrUnblockOrDelete from '../BlockOrUnblockOrDelete/BlockOrUnblockOrDelete';
import Dropdown from '../Dropdown/DropDown';
import { useModal } from '../Modal/Context';
import { ActionType } from '../types';

export const getActionMessage = (actionType: ActionType) => {
  if (actionType === 'Block') {
    return 'block this user';
  }
  if (actionType === 'Unblock') {
    return 'unblock this user';
  }
  return 'delete this user';
};

export default function ActionDropDown({
  user,
  data,
}: {
  user: IUser;
  data: Session | null;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [currentUser, setCurrentUser] = useState<IUser>();

  const hideModal = useModal({});
  const closeMoal = () => {
    hideModal();
    setActionType(null);
    setCurrentUser(undefined);
  };
  const modal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} User`,
    },
    content: (
      <AddorEditUser
        actionType={actionType}
        onClose={closeMoal}
        currentUser={currentUser}
      />
    ),
  });

  const handleConfirm = async (reason?: string) => {
    if (!currentUser || !currentUser.id) {
      return;
    }
    let response;
    if (actionType === 'Block' && reason) {
      response = await UserService.blockUser({ reason }, currentUser?.id);
    } else if (actionType === 'Unblock') {
      response = await UserService.unBlockUser(currentUser.id);
    } else if (actionType === 'Delete') {
      response = await UserService.deleteUser(currentUser.id);
    }
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };

    if (success) {
      toast.success(`User ${actionType}`);
      hideModal();
      setCurrentUser(undefined);
      setActionType(null);
      router.refresh();
    } else {
      toast.error(error[0]);
    }
  };

  const blockOrUnblockOrDeleteModal = useModal({
    style: {
      size: 'sm',
      title: `${actionType} User`,
    },
    content: (
      <BlockOrUnblockOrDelete
        actionType={actionType}
        onConfirm={handleConfirm}
        onClose={closeMoal}
        deleteText={`Are you sure you want to ${getActionMessage(actionType)} this user?`}
      />
    ),
  });

  useEffect(() => {
    if (!currentUser && actionType === 'Invite') {
      modal();
    }
    switch (actionType) {
      case 'Edit':
      case 'Resend Invitation':
        modal();
        break;
      case 'Block':
      case 'Unblock':
      case 'Delete':
        blockOrUnblockOrDeleteModal();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, actionType]);

  return ['SUPERADMIN', 'ADMIN']?.includes(
    (data?.user as IUser)?.role?.name,
  ) ? (
    <Dropdown>
      <ul className="dropdown_section row">
        {user?.status !== 'BLOCKED' ? (
          <>
            {user?.status !== 'ACTIVE' && (
              <li
                aria-hidden
                className="dropdown_item px-4"
                onClick={() => {
                  setActionType('Resend Invitation');
                  setCurrentUser(user);
                }}
              >
                Resend Invitation
              </li>
            )}
            {user?.status === 'ACTIVE' && (
              <li
                aria-hidden
                className="dropdown_item px-4"
                onClick={() => {
                  setActionType('Edit');
                  setCurrentUser(user);
                }}
              >
                Edit
              </li>
            )}
            {user?.status === 'ACTIVE' && user?.id !== data?.user?.id && (
              <>
                <li
                  aria-hidden
                  className="dropdown_item px-4"
                  onClick={() => {
                    setActionType('Delete');
                    setCurrentUser(user);
                  }}
                >
                  Delete
                </li>
                <li
                  aria-hidden
                  className="dropdown_item px-4"
                  onClick={() => {
                    setActionType('Block');
                    setCurrentUser(user);
                  }}
                >
                  Block
                </li>
              </>
            )}
          </>
        ) : (
          <li
            aria-hidden
            className="dropdown_item px-4"
            onClick={() => {
              setActionType('Unblock');
              setCurrentUser(user);
            }}
          >
            Unblock
          </li>
        )}
      </ul>
    </Dropdown>
    ) : (
      <div>-</div>
    );
}
