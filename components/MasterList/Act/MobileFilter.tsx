'use client';

import AccountFilter from '@/components/Filter/AccountFilter/AccountFilter';
import ParentMobileFilter from '@/components/MobileFilter/ParentMobileFilter';

export default function MobileFilter({ params }: { params: Record<string, string> }) {
  return (
    <ParentMobileFilter>
      {({ onCancel }) => <AccountFilter params={params} onCancel={onCancel} />}
    </ParentMobileFilter>
  );
}
