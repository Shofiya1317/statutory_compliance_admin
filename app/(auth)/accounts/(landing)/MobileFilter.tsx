'use client';

import AccountFilter from '@/components/Filter/AccountFilter/AccountFilter';
import ParentMobileFilter from '@/components/MobileFilter/ParentMobileFilter';
import { IAccountFilter } from '@/lib/interface/IAccount.interface';

export default function MobileFilter({ params }: { params: IAccountFilter }) {
  return (
    <ParentMobileFilter>
      {({ onCancel }) => <AccountFilter params={params} onCancel={onCancel} />}
    </ParentMobileFilter>
  );
}
