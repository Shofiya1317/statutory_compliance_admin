'use client';

import ParentMobileFilter from '@/components/MobileFilter/ParentMobileFilter';
import { Params } from '@/lib/utils';
import { useParams } from 'next/navigation';
import MasterFilter from '../MasterFilter/MasterFilter';

export default function MobileFilter({ params }: { params: Params }) {
  const urlParams = useParams();
  return (
    <ParentMobileFilter>
      {({ onCancel }) => (
        <MasterFilter
          params={params}
          slug={urlParams?.slug as string}
          onCancel={onCancel}
        />
      )}
    </ParentMobileFilter>
  );
}
