/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, Spinner, Table } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import * as Interfaces from '@interfaces';
import { getReportCashFlowService } from '@services/reportService';
import TableLoadingRow from '../TableLoadingRow';

import { fuzzyFilter, uDate, uRupiah } from '@utils/utils';
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import FeatherIcon from '@components/Icons/FeatherIcon';
import Paginate from '@components/Paginate/Paginate';

type Props = {};

function TableReportCashFlow({}: Props) {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const fetchQueryKey = React.useMemo(
    () => ['report-cashflow', fetchDataOptions],
    [fetchDataOptions]
  );

  const columnsDefs = React.useMemo<ColumnDef<Interfaces.IReportCashFlow>[]>(
    () => [
      {
        enableSorting: false,
        accessorFn: (row) => row.createdAt,
        header: 'Waktu',
        cell: (info) => {
          const infoValue = info.getValue() as string;
          return uDate(infoValue);
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
          return infoValue === 'IN' ? 'Masuk' : 'Keluar';
        },
      },
      {
        enableSorting: false,

        // eslint-disable-next-line no-underscore-dangle
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

        // eslint-disable-next-line no-underscore-dangle
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

  const dataQuery = useQuery(
    fetchQueryKey,
    () => getReportCashFlowService(fetchDataOptions),
    { keepPreviousData: true }
  );
  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: dataQuery?.data?.rows ?? defaultData,
    columns: columnsDefs,
    pageCount: dataQuery?.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: false,
  });

  const rows = table?.getRowModel()?.rows;
  const headers = table.getFlatHeaders();

  return (
    <Card>
      <Card.Header className="pt-4 d-flex justify-content-between align-items-center ">
        <Card.Title className=" mb-0">Semua Data Laporan Kas</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="text-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: ` d-flex align-items-center justify-content-between ${
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }`,
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <span className="d-flex flex-column justify-content-center ms-2">
                                <FeatherIcon
                                  className=" text-dark mb-n1"
                                  name="ChevronUp"
                                  size={18}
                                />
                                <FeatherIcon
                                  className=" text-muted mt-n1 "
                                  name="ChevronDown"
                                  size={18}
                                />
                              </span>
                            ),
                            desc: (
                              <span className="d-flex flex-column justify-content-center ms-2">
                                <FeatherIcon
                                  className=" text-muted mb-n1"
                                  name="ChevronUp"
                                  size={18}
                                />
                                <FeatherIcon
                                  className=" text-dark mt-n1 "
                                  name="ChevronDown"
                                  size={18}
                                />
                              </span>
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            <TableLoadingRow
              isError={dataQuery?.isError}
              rows={rows}
              isLoading={dataQuery.isLoading}
              headerLength={headers.length}
            />

            {rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className=" d-flex gap-3 justify-content-between flex-wrap">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-1">
            <span>Menampilan</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} dari{' '}
              {table.getPageCount()} halaman
            </strong>{' '}
            dari {dataQuery?.data?.entriesCount} data |
            <span> {table.getRowModel().rows.length} baris ditampilakan</span>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-end align-items-center   ">
          {dataQuery.isFetching ? (
            <div className="me-3 h-100 d-flex align-items-center ">
              <Spinner
                size="sm"
                animation="border"
                variant="primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : null}
          <Paginate
            onPrevPage={() => table.previousPage()}
            isHasPrevPage={table.getCanPreviousPage()}
            onNextPage={() => table.nextPage()}
            isHasNextPage={table.getCanNextPage()}
            totalPages={table.getPageCount()}
            loading={dataQuery?.isLoading}
            activePage={table.getState().pagination.pageIndex + 1}
            onSetPage={table.setPageIndex}
          />
        </div>
      </Card.Footer>
    </Card>
  );
}

export default TableReportCashFlow;
