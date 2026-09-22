'use client';

import { useState } from 'react';
import Button from '../Button/Button';
import { ActionType } from '../types';

export default function BlockOrUnblockOrDelete({
  actionType,
  onConfirm,
  onClose,
  deleteText,
}: Readonly<{
  actionType: ActionType;
  onConfirm: (data: string) => void;
  onClose: () => void;
  deleteText: string;
}>) {
  const [reason, setReason] = useState('');

  return (
    <div className="text-center">
      <p className="h5 fw-medium mb-3">{deleteText}</p>
      {(actionType === 'Block'
        || actionType === 'Suspend'
        || actionType === 'Delete') && (
        <textarea
          rows={4}
          cols={40}
          value={reason}
          onChange={(e) => setReason(e?.target?.value)}
          placeholder={`Enter reason for ${actionType.toLocaleLowerCase()}ing`}
          className="form-control"
        />
      )}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button
          className="py-2 btn-sm px-sm-4 Cancelbtn me-3"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="py-2 btn-sm px-sm-4 savebtn"
          disabled={
            (actionType === 'Block'
              || actionType === 'Suspend'
              || actionType === 'Delete')
            && reason.trim() === ''
          }
          onClick={() => onConfirm(reason)}
        >
          {actionType as string}
        </Button>
      </div>
    </div>
  );
}
