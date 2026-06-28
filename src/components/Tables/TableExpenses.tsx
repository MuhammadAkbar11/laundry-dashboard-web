/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import { IExpenses } from '@interfaces';
import AdminDataTable from './AdminDataTable';
import { uRupiah } from '@utils/utils';

type Props = {
  rows: IExpenses[];
  isLoading: boolean;
  isError: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  entriesCount: number;
  sorting: rtb.SortingState;
  globalFilter: string;
  onSortingChange: rtb.OnChangeFn<rtb.SortingState>;
  onPaginationChange: rtb.OnChangeFn<rtb.PaginationState>;
  onGlobalFilterChange: (value: string) => void;
  onEdit: (row: IExpenses) => void;
  onDelete: (row: IExpenses) => void;
  onExport: () => void;
  exportLoading: boolean;
};

function TableExpenses({
  rows,
  isLoading,
  isError,
  pageCount,
  pageIndex,
  pageSize,
  entriesCount,
  sorting,
  globalFilter,
  onSortingChange,
  onPaginationChange,
  onGlobalFilterChange,
  onEdit,
  onDelete,
  onExport,
  exportLoading,
}: Props) {
  const columns = React.useMemo<rtb.ColumnDef<IExpenses>[]>(
    () => [
      {
        id: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => pageIndex * pageSize + row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'expensesInvoice',
        header: 'Invoice',
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: 'description',
        header: 'Deskripsi',
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => uRupiah(Number(info.getValue<number>())),
      },
      {
        accessorKey: 'createdAt',
        header: 'Tanggal',
        cell: (info) => {
          const value = info.getValue<string>();
          return new Date(value).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        },
      },
      {
        id: 'action',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(row.original)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [pageIndex, pageSize, onEdit, onDelete]
  );

  return (
    <AdminDataTable<IExpenses>
      title="Data Pengeluaran"
      columns={columns}
      data={rows}
      isLoading={isLoading}
      isError={isError}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      entriesCount={entriesCount}
      sorting={sorting}
      globalFilter={globalFilter}
      onSortingChange={onSortingChange}
      onPaginationChange={onPaginationChange}
      onGlobalFilterChange={onGlobalFilterChange}
      searchPlaceholder="Cari data pengeluaran"
      headerActions={
        <Button variant="success" onClick={onExport} disabled={exportLoading}>
          {exportLoading ? 'Mengunduh...' : 'Export CSV'}
        </Button>
      }
    />
  );
}

export default TableExpenses;
