/* eslint-disable react/require-default-props */
import React from 'react';
import { Button } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import { IAuditLog } from '@interfaces';
import AdminDataTable from './AdminDataTable';

const ACTION_VARIANTS: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'primary',
  DELETE: 'danger',
  LOGIN: 'info',
  LOGOUT: 'secondary',
  PASSWORD_RESET: 'warning',
  STATUS_CHANGE: 'dark',
};

type Props = {
  rows: IAuditLog[];
  isLoading: boolean;
  isError?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  entriesCount: number;
  sorting: rtb.SortingState;
  globalFilter: string;
  onSortingChange: rtb.OnChangeFn<rtb.SortingState>;
  onPaginationChange: rtb.OnChangeFn<rtb.PaginationState>;
  onGlobalFilterChange: (value: string) => void;
  onDetail: (row: IAuditLog) => void;
};

function TableAuditLogs({
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
  onDetail,
}: Props) {
  const columns = React.useMemo<rtb.ColumnDef<IAuditLog>[]>(
    () => [
      {
        id: 'no',
        header: 'No',
        size: 50,
        cell: ({ row }) => pageIndex * pageSize + row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'createdAt',
        header: 'Waktu',
        cell: (info) => {
          const value = info.getValue<string>();
          return new Date(value).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        accessorKey: 'action',
        header: 'Aksi',
        cell: (info) => {
          const value = info.getValue<string>();
          const variant = ACTION_VARIANTS[value] || 'secondary';
          return <span className={`badge bg-${variant}`}>{value}</span>;
        },
      },
      {
        accessorKey: 'entityType',
        header: 'Tipe Entitas',
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: 'entityId',
        header: 'ID Entitas',
        cell: (info) => info.getValue<string>(),
      },
      {
        id: 'actor',
        header: 'Aktor',
        cell: ({ row }) => {
          const { actorName, actorRole, actorId } = row.original;
          return (
            <div>
              <div>{actorName || actorId || '-'}</div>
              {actorRole && <small className="text-muted">{actorRole}</small>}
            </div>
          );
        },
      },
      {
        id: 'detail',
        header: 'Detail',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onDetail(row.original)}
          >
            Detail
          </Button>
        ),
      },
    ],
    [pageIndex, pageSize, onDetail]
  );

  return (
    <AdminDataTable<IAuditLog>
      title="Riwayat Audit Log"
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
      searchPlaceholder="Cari audit log"
    />
  );
}

export default TableAuditLogs;
