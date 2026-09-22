/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { IMeta } from '../../lib/interface/IMeta.interface';
import { buildQueryParams } from '../../lib/utils';
import './Table.css';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  meta?: IMeta;
}

export const handlePageChange = (
  page: number,
  setCurrentPage: (data: number) => void,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
) => {
  setCurrentPage(page);
  const query = buildQueryParams({
    ...Object.fromEntries(new URLSearchParams(searchParams?.toString() || '')),
    page: page.toString(),
  }).toString();
  router.push(`?${query}`);
};

export const handleRowsPerPageChange = (
  newLimit: number,
  setRowsPerPage: (data: number) => void,
  setCurrentPage: (data: number) => void,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
) => {
  setRowsPerPage(newLimit);
  setCurrentPage(1);
  const query = buildQueryParams({
    ...Object.fromEntries(new URLSearchParams(searchParams?.toString() || '')),
    page: '1',
    limit: newLimit.toString(),
  }).toString();
  router.push(`?${query}`);
};

function Table<T>({ data, columns, meta }: Readonly<TableProps<T>>) {
  const [currentPage, setCurrentPage] = useState(Number(meta?.currentPage));
  const [rowsPerPage, setRowsPerPage] = useState(Number(meta?.currentLimit));
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <DataTable
      columns={columns}
      className="clm-data-table"
      data={data}
      pagination
      paginationServer
      paginationTotalRows={meta?.totalCount}
      paginationDefaultPage={currentPage}
      paginationPerPage={rowsPerPage}
      onChangePage={(page: number) => handlePageChange(page, setCurrentPage, searchParams, router)}
      onChangeRowsPerPage={(row: number) => handleRowsPerPageChange(
        row,
        setRowsPerPage,
        setCurrentPage,
        searchParams,
        router,
      )}
    />
  );
}

export default Table;
