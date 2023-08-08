/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import clsx from 'classnames';
import FeatherIcon from '@components/Icons/FeatherIcon';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import Paginate from '@components/Paginate/Paginate';
import useDataQuery from '@hooks/useDataQuery';
import { fuzzyFilter, uDate } from '@utils/utils';
import { ILaundryQueue, IServiceWithPaginateReturn } from '@interfaces';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
import { getMemberLaundryQueueService } from '@services/memberService';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import { LaundryQueueStatusType } from '@types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCancel,
  faHandPaper,
  faShippingFast,
} from '@fortawesome/free-solid-svg-icons';

type Props = {};

function MemberTableLaundryQueue({}: Props) {
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
    queryKeyPrefix: 'memberLaundryQueues',
    defaultSorting: [],
    queryFn: getMemberLaundryQueueService,
    defaultData: [],
  });

  const columnsDefs = React.useMemo<rtb.ColumnDef<ILaundryQueue>[]>(
    () => [
      {
        accessorKey: 'laundryQueueId',
        header: 'ID',
        size: 60,
      },
      {
        enableSorting: false,
        accessorFn: (row) => row.createdAt,
        id: 'createdAt',
        header: () => 'Tgl Pemesanan',
        cell: (info) => {
          const value = info.getValue() as string;
          return (
            <p className="mb-1">
              <b>{uDate(value)}</b>
            </p>
          );
        },
      },
      {
        enableSorting: false,
        accessorFn: (row) => row,
        id: 'date',
        header: () => 'Tgl Penyerahan',
        cell: (info) => {
          const data = info.getValue() as ILaundryQueue;
          return (
            <p className="mb-1">
              <b>{uDate(data?.pickupAt)}</b>
            </p>
          );
        },
      },
      // {
      //   enableSorting: false,
      //   accessorFn: (row) => row.deliveryAddress,
      //   id: 'deliveryAddress',
      //   header: () => 'Alamat',
      //   cell: (info) => {
      //     const value = info.getValue() as string;
      //     return <p className="text-truncate-2">{value || '-'}</p>;
      //   },
      //   // size: 50,
      //   minSize: 180,
      // },

      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        cell: (info) => {
          const value = info.getValue<LaundryQueueStatusType>();
          return <LQStatusBadge value={value} />;
        },
      },
      {
        accessorFn: (row) => row.deliveryType,
        id: 'deliveryType',
        header: () => 'Jenis Pengiriman',
        cell: (info) => {
          const value = info.getValue() as string;
          return (
            <div>
              {value === 'PICKUP' ? (
                <Badge className=" bg-accent1 p-2 rounded-0">
                  <FontAwesomeIcon
                    icon={faHandPaper}
                    className=" d-inline-flex me-1 "
                  />
                  <span className="ms-1">Self Pickup</span>
                </Badge>
              ) : (
                <Badge className=" bg-accent2 p-2 rounded-0">
                  <FontAwesomeIcon
                    icon={faShippingFast}
                    className="d-inline-flex me-1 "
                  />
                  <span className="ms-1">Delivery</span>
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'action',
        accessorFn: (row) => row,
        header: '',
        cell: (info) => {
          const data = info.getValue<ILaundryQueue>();

          return (
            <div className="d-flex gap-1">
              {/* <Button
                size="sm"
                variant="blue"
                className="d-inline-flex align-items-center "
                onClick={() => {
                  // laundryQueueDetailCtx.onOpen({
                  //   laundryQueueId: data.laundryQueueId,
                  //   fetchQueryKey,
                  // });
                }}
              >
                <FontAwesomeIcon className="fa-fw" icon={faInfoCircle} />
                <span className="ms-1">Detail</span>
              </Button> */}
              <Button
                size="sm"
                variant="danger"
                className="d-inline-flex  align-items-center"
                disabled={
                  data?.status === 'FINISHED' ||
                  data?.status === 'WASHED' ||
                  data?.status === 'ONHOLD' ||
                  data?.status === 'CANCELED'
                }
                onClick={() => {
                  // Action
                }}
              >
                <FontAwesomeIcon className="fa-fw" icon={faCancel} />
                <span className="ms-1">Batal</span>
              </Button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    // [fetchQueryKey, laundryQueueDetailCtx]
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

export default MemberTableLaundryQueue;
