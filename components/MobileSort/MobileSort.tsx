'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export interface InputFieldProps {
  setIsShown: (data: boolean) => void;
  isShown: boolean;
}

export default function MobileSort({ setIsShown, isShown }: InputFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortValue, setSortValue] = useState(
    searchParams?.get('sort') || '-createdAt',
  );
  const buildQueryParams = (param: { sort: string }) => new URLSearchParams({
    ...Object.fromEntries(
      new URLSearchParams(searchParams?.toString() || ''),
    ),
    ...param,
  });

  const updateSortValue = (data: string) => {
    setIsShown(!isShown);
    setSortValue(data);
    const query = buildQueryParams({ sort: data || sortValue }).toString();
    router.push(`?${query}`);
    return query;
  };

  return (
    <div className="dropdownsortMobile">
      <div className=" pt-2 d-flex justify-content-between align-items-center sortingline">
        <h6 className=" fw-bold m-0"> Sort by </h6>
      </div>
      <div className="pt-3 sortingh6">
        <h6 aria-hidden onClick={() => updateSortValue('createdAt')}>
          Date - Ascending
        </h6>
        <h6 aria-hidden onClick={() => updateSortValue('-createdAt')}>
          Date - Recent
        </h6>
        <h6 aria-hidden onClick={() => updateSortValue('name')}>
          Name (A-Z)
        </h6>
        <h6 aria-hidden onClick={() => updateSortValue('-name')}>
          Name (Z-A)
        </h6>
      </div>
    </div>
  );
}
