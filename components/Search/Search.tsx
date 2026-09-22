'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { updateQueryParams } from '../../lib/utils';
import { ISearchProps } from '../types';
import './Search.css';

export default function Search({ params }: ISearchProps) {
  const pathname = usePathname();
  const router = useRouter();

  const searchOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    updateQueryParams(
      { search: e?.target?.value, page: 1 },
      router,
      params,
      pathname,
    );
  };
  return (
    <input
      type="text"
      placeholder="Search"
      className="form-control me-2 py-2"
      defaultValue={(params?.search as string) || ''}
      name="search"
      onChange={searchOnchange}
      maxLength={50}
    />
  );
}
