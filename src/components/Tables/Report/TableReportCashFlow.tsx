/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Badge } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import { IReportCashFlow } from '@interfaces';
import AdminDataTable from '../AdminDataTable';
import { uDate, uRupiah } from '@utils/utils';
import { getReportCashFlowService } from '@services/reportService';
import useDataQuery from '@hooks/useDataQuery';

type Props = {};

function TableReportCashFlow({}: Props) {
  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    dataQuery,
  } = useDataQuery<
    | {
        rows: IReportCashFlow[];
        entriesCount?: number;
        pageCount?: number;
      }
    | IReportCashFlow[]
  >({
    queryKeyPrefix: 'report-cashflow',
    queryFn: (opt) => {
      return getReportCashFlowService({
        pageIndex: opt.pageIndex,
        pageSize: opt.pageSize,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultData: { rows: [], entriesCount: 0, pageCount: 0 } as any,
    defaultSorting: [],
  });

  const columns = React.useMemo<rtb.ColumnDef<IReportCashFlow>[]>(
    () => [
      {
        enableSorting: false,
        accessorFn: (row) => row.createdAt,
        header: 'Waktu',
        cell: (info) => {
          const infoValue = info.getValue() as string;
          return uDate(infoValue, 'short');
        },
      },
      {
        enableSorting: false,
        accessorKey: 'cashflowInvoice',
        header: 'Invoice',
      },
      {
        enableSorting: false,
        accessorFn: (row) => row.cashflowType,
        id: 'type',
        header: 'Keterangan',
        cell: (info) => {
          const infoValue = info.getValue() as any;
          return infoValue === 'IN' ? (
            <Badge bg="success">Masuk</Badge>
          ) : (
            <Badge bg="danger">Keluar</Badge>
          );
        },
      },
      {
        enableSorting: false,
        accessorFn: (row) => row.total,
        id: 'total',
        header: () => 'Total',
        cell: (info) => {
          const value = info.getValue() as number;
          return <span>{uRupiah(+value)}</span>;
        },
      },
      {
        enableSorting: false,
        accessorFn: (row) => row.balance,
        id: 'balance',
        header: () => 'Saldo',
        cell: (info) => {
          const value = info.getValue() as number;
          return <span>{uRupiah(+value)}</span>;
        },
      },
    ],
    []
  );

  const apiData = dataQuery?.data as any;
  const rows: IReportCashFlow[] = apiData?.rows || [];

  return (
    <AdminDataTable<IReportCashFlow>
      title="Semua Data Laporan Kas"
      columns={columns}
      data={rows}
      isLoading={dataQuery?.isLoading}
      isError={dataQuery?.isError}
      pageCount={apiData?.pageCount ?? 0}
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      entriesCount={apiData?.entriesCount ?? 0}
      sorting={sorting}
      globalFilter={globalFilter}
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      onGlobalFilterChange={setGlobalFilter}
      searchPlaceholder="Cari data laporan kas"
    />
  );
}

export default TableReportCashFlow;
