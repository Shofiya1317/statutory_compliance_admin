'use client';

import UserFilter from '@/components/Filter/UserFilter/UserFilter';
import ParentMobileFilter from '@/components/MobileFilter/ParentMobileFilter';
import { IUserFilter } from '@/lib/interface/IUser.interface';

export default function MobileFilter({ params }: { params: IUserFilter }) {
  return (
    <ParentMobileFilter>
      {({ onCancel }) => <UserFilter params={params} onCancel={onCancel} />}
    </ParentMobileFilter>
  );
}
