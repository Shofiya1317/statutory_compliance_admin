/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */

'use client';

import { IMeta } from '@/lib/interface/IMeta.interface';
import { buildQueryParams } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  meta: IMeta;
  currentPage?: string;
  setCurrentPage?: (data: number) => void;
  component?: string;
};

export default function Pagination({
  meta,
  currentPage = '1',
  setCurrentPage,
  component = '',
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const metaTotalCount = meta?.totalCount ?? 0;
  const maxPages = Math.ceil(metaTotalCount / parseInt(meta?.currentLimit, 10));

  const handlePageChange = (value: number) => {
    if (setCurrentPage) {
      setCurrentPage(value);
    } else {
      const queryParams = buildQueryParams({
        ...Object.fromEntries(
          new URLSearchParams(searchParams?.toString() || ''),
        ),
        page: value,
      });
      router.push(`?${queryParams}`);
    }
  };

  const items: JSX.Element[] = [];
  const leftSide = Math.max(parseInt(currentPage, 10) - 1, 1);
  const rightSide = Math.min(parseInt(currentPage, 10) + 2, maxPages);

  for (let number = leftSide; number <= rightSide; number++) {
    items.push(
      <div
        key={number}
        className={
          number === parseInt(currentPage, 10)
            ? 'round-effect activeEffect'
            : 'round-effect'
        }
        onClick={() => handlePageChange(number)}
        onKeyDown={(e) => e.key === 'Enter' && handlePageChange(number)}
        role="button"
        tabIndex={0}
      >
        {number}
      </div>,
    );
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        {'Showing '}
        {parseInt(meta?.currentLimit, 10) * (parseInt(currentPage, 10) - 1) + 1}
        {' - '}
        {Math.min(
          parseInt(meta?.currentLimit, 10) * parseInt(currentPage, 10),
          metaTotalCount,
        )}
        {' from '}
        {metaTotalCount}
        {` ${component}`}
      </div>

      <div className="d-flex">
        {parseInt(currentPage, 10) > 2 && (
          <div
            className="round-effect"
            onClick={() => handlePageChange(1)}
            onKeyDown={(e) => e.key === 'Enter' && handlePageChange(1)}
            role="button"
            tabIndex={0}
          >
            &lsaquo; &lsaquo;
          </div>
        )}
        {parseInt(currentPage, 10) > 1 && (
          <div
            className="round-effect"
            onClick={() => handlePageChange(parseInt(currentPage, 10) - 1)}
            onKeyDown={(e) => e.key === 'Enter'
              && handlePageChange(parseInt(currentPage, 10) - 1)}
            role="button"
            tabIndex={0}
          >
            &lsaquo;
          </div>
        )}
        {items}
        {parseInt(currentPage, 10) < maxPages && (
          <div
            className="round-effect"
            onClick={() => handlePageChange(parseInt(currentPage, 10) + 1)}
            onKeyDown={(e) => e.key === 'Enter'
              && handlePageChange(parseInt(currentPage, 10) + 1)}
            role="button"
            tabIndex={0}
          >
            &rsaquo;
          </div>
        )}
        {parseInt(currentPage, 10) < maxPages - 1 && (
          <div
            className="round-effect"
            onClick={() => handlePageChange(maxPages)}
            onKeyDown={(e) => e.key === 'Enter' && handlePageChange(maxPages)}
            role="button"
            tabIndex={0}
          >
            &rsaquo; &rsaquo;
          </div>
        )}
      </div>
    </div>
  );
}
