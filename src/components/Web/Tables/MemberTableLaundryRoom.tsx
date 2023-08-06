/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Link from 'next/link';
import { Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import clsx from 'classnames';
import FeatherIcon from '@components/Icons/FeatherIcon';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import Paginate from '@components/Paginate/Paginate';
import useDataQuery from '@hooks/useDataQuery';
import { fuzzyFilter, uDate, uRupiah } from '@utils/utils';
import {
  ILaundryQueue,
  IListLaundryRoom,
  IServiceWithPaginateReturn,
} from '@interfaces';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import { getMemberLaundryRoomService } from '@services/memberService';
import { LaundryQueueStatusType } from '@types';
import LRMStatusBadge from '@components/Badges/LRMStatusBadge';

type Props = {};

function MemberTableLaundryRoom({}: Props) {
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
    queryKeyPrefix: 'memberLaundryRooms',
    defaultSorting: [],
    queryFn: getMemberLaundryRoomService,
    defaultData: [],
  });

  const columnsDefs = React.useMemo<rtb.ColumnDef<IListLaundryRoom>[]>(
    () => [
      {
        accessorKey: 'laundryQueueId',
        header: () => 'ID',
        size: 60,
      },
      {
        enableSorting: false,
        accessorFn: (row) => row,
        id: 'date',
        header: () => 'Tgl Pencucian',
        cell: (info) => {
          const data = info.getValue() as IListLaundryRoom;

          return uDate(data?.createdAt);
        },
        // size: 50,
        minSize: 150,
      },
      {
        accessorFn: (row) => row.laundryQueue?._count?.laundries,
        id: 'countLaundries',
        header: () => 'Total Cucian',
        cell: (info) => {
          const value = info.getValue() as number;
          return <span>{value} Cucian</span>;
        },
        // sortingFn: (info) => info.g
        size: 50,
      },
      {
        enableSorting: false,
        // eslint-disable-next-line no-underscore-dangle
        accessorFn: (row) => row?.total,
        id: 'total',
        header: () => 'Total Harga',
        cell: (info) => `${uRupiah(info?.getValue() as number)}`,
        size: 2,
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        cell: (info) => {
          const value = info.getValue() as LaundryQueueStatusType;
          return <LRMStatusBadge value={value} />;
        },
        // sortingFn: (info) => info.g
        size: 50,
      },
      {
        accessorKey: 'action',
        accessorFn: (row) => row,
        header: '',
        size: 50,
        cell: (info) => {
          const data = info.getValue<IListLaundryRoom>();
          return (
            <div className="d-flex gap-1">
              <Link
                passHref
                legacyBehavior
                href={`/m/cucian/${data?.laundryQueueId}`}
              >
                <Button size="sm" variant="blue">
                  <FeatherIcon name="Info" size={14} />
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

  // console.log(dataQuery?.data, dataQuery?.isLoading);
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
              placeholder="Cari data cucian"
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
              headerLength={tableHeaders.length}
              variant="accent1"
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

export default MemberTableLaundryRoom;
