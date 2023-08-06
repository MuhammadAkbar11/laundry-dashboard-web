/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Button, Card, Spinner, Table } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import clsx from 'classnames';
import FeatherIcon from '@components/Icons/FeatherIcon';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import Paginate from '@components/Paginate/Paginate';
import useDataQuery from '@hooks/useDataQuery';
import Link from 'next/link';
import { fuzzyFilter, uDate, uRupiah } from '@utils/utils';
import {
  ILaundryQueue,
  IPayment,
  IServiceWithPaginateReturn,
} from '@interfaces';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import { getMemberTransactionService } from '@services/memberService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function MemberTableTrx({}: Props) {
  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    dataQuery,
    defaultData,
  } = useDataQuery<IServiceWithPaginateReturn<ILaundryQueue>>({
    queryKeyPrefix: 'memberTransaction',
    defaultSorting: [],
    queryFn: getMemberTransactionService,
    defaultData: [],
  });

  const columnsDefs = React.useMemo<rtb.ColumnDef<IPayment>[]>(
    () => [
      {
        accessorKey: 'invoice',
        header: 'Invoice',
        size: 60,
      },
      {
        accessorFn: (row) => row.createdAt,
        id: 'createdAt',
        header: () => 'Tanggal Transaksi',
        cell: (info) => {
          const value = info.getValue() as string;
          return <span className=" text-capitalize ">{uDate(value)}</span>;
        },
      },
      {
        // eslint-disable-next-line no-underscore-dangle
        accessorFn: (row) => row.totalLaundry,
        id: 'totalLaundry',
        header: () => 'Total Layana',
        cell: (info) => {
          const value = info.getValue() as number;
          return <span>{value}</span>;
        },
      },
      // {
      //   // eslint-disable-next-line no-underscore-dangle
      //   accessorFn: (row) => row.totalPrice,
      //   id: 'totalPrice',
      //   header: () => 'Total Harga',
      //   cell: (info) => {
      //     const value = info.getValue() as number;
      //     return <span>{uRupiah(+value)}</span>;
      //   },
      // },
      {
        // eslint-disable-next-line no-underscore-dangle
        accessorFn: (row) => row.totalPrice,
        id: 'totalPrice',
        header: () => 'Total Harga',
        cell: (info) => {
          const value = info.getValue() as number;
          return <span>{uRupiah(+value)}</span>;
        },
      },
      {
        accessorKey: 'action',
        accessorFn: (row) => row,
        header: '',
        cell: (info) => {
          const trxInfo = info.getValue<IPayment>();
          return (
            <div className="d-flex gap-1">
              <Link
                passHref
                legacyBehavior
                href={`/m/transaksi/${trxInfo?.invoice}`}
              >
                <Button size="sm" variant="info">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </Button>
              </Link>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  const table = rtb.useReactTable({
    data: dataQuery?.data?.rows ?? defaultData,
    columns: columnsDefs,
    pageCount: dataQuery?.data?.pageCount ?? -1,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: rtb.getCoreRowModel(),
    getSortedRowModel: rtb.getSortedRowModel(),
    getFacetedRowModel: rtb.getFacetedRowModel(),
    getFacetedUniqueValues: rtb.getFacetedUniqueValues(),
    getFacetedMinMaxValues: rtb.getFacetedMinMaxValues(),
    manualPagination: true,
    debugTable: false,
  });

  const tableRows = table?.getRowModel()?.rows;
  const tableHeaders = table.getFlatHeaders();

  return (
    <Card className="border-0  shadow-none">
      <Card.Body className="pb-1 px-0 table-responsive">
        <div className=" d-flex justify-content-end mb-3 px-1">
          <div>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => {
                setGlobalFilter(String(value));
              }}
              className="form-control py-3"
              placeholder="Cari data Antrian"
            />
          </div>
        </div>
        <Table hover>
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
                            className: clsx(
                              'd-flex align-items-center justify-content-between',
                              {
                                'cursor-pointer select-none':
                                  header.column.getCanSort(),
                              }
                            ),
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {rtb.flexRender(
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
              rows={tableRows}
              isLoading={dataQuery.isLoading}
              variant="accent1"
              headerLength={tableHeaders.length}
            />

            {tableRows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {rtb.flexRender(
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
      <Card.Footer className=" d-flex justify-content-end flex-wrap">
        <div className="d-flex flex-wrap justify-content-end align-items-center px-0   ">
          {dataQuery.isFetching ? (
            <div className="me-3 h-100 d-flex align-items-center ">
              <Spinner
                size="sm"
                animation="border"
                variant="accent1"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : null}
          <Paginate
            className="web-pagination"
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

export default MemberTableTrx;
