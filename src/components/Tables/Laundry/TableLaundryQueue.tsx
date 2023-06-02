/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Badge, Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import clsx from 'classnames';
import BoxButton from '@components/Buttons/BoxButton';
import FeatherIcon from '@components/Icons/FeatherIcon';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import Paginate from '@components/Paginate/Paginate';
import ShowMore from '@components/Utils/ShowMore';
import LQPayStatusBadge from '@components/Badges/LQPayStatusBadge';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import useDataQuery from '@hooks/useDataQuery';
import { useLaundryQueueDeleteContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDeleteContext';
import { useLaundryQueueCreateContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueCreateContext';
import { IServiceWithPaginateReturn } from '@utils/interfaces';
import { fuzzyFilter, uDate, uRupiah } from '@utils/utils';
import {
  ILaundryQueue,
  LaundryQueueStatusType,
  getLaundryQueueService,
} from '@services/laundryQueueService';
import TableLoadingRow from '../TableLoadingRow';

type Props = {};

function TableLaundryQueue({}: Props) {
  const createLaundryQueueCtx = useLaundryQueueCreateContext();
  const laundryQueueDelCtx = useLaundryQueueDeleteContext();

  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    dataQuery,
    defaultData,
    fetchQueryKey,
  } = useDataQuery<IServiceWithPaginateReturn<ILaundryQueue>>({
    queryKeyPrefix: 'laundry-queues',
    defaultSorting: [],
    queryFn: getLaundryQueueService,
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
        accessorFn: (row) => row.customer.name,
        id: 'customerName',
        header: () => 'Nama Plgn',
        cell: (info) => {
          const value = info.getValue() as string;
          return <span>{value}</span>;
        },
        size: 50,
      },
      {
        enableSorting: false,
        accessorFn: (row) => row,
        id: 'date',
        header: () => 'Waktu',
        cell: (info) => {
          const data = info.getValue() as ILaundryQueue;
          return (
            <>
              {/* Tss */}
              <p className="mb-1">
                Masuk : <br /> <b>{uDate(data?.createdAt)}</b>
              </p>
              <ShowMore initialText="Lebih lanjut...">
                {/* <br /> */}
                <p className="mb-1">
                  Selesai : <br />{' '}
                  <b>{uDate(data?.finishedAt as string) || '-'}</b>
                </p>
                <p className="mb-1">
                  Diambil : <br />{' '}
                  <b>{uDate(data?.deliveryAt as string) || '-'}</b>
                </p>
              </ShowMore>
            </>
          );
        },
        // size: 50,
        minSize: 150,
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: () => 'Status',
        cell: (info) => {
          const value = info.getValue() as LaundryQueueStatusType;

          return <LQStatusBadge value={value} />;
        },
        // sortingFn: (info) => info.g
        size: 50,
      },
      {
        enableSorting: false,
        // eslint-disable-next-line no-underscore-dangle
        accessorFn: (row) => row?.laundryRooms?.total,
        id: 'total',
        header: () => 'Total Harga',
        cell: (info) => `${uRupiah(info.getValue() as number)}`,
        size: 2,
      },
      {
        accessorFn: (row) => row.queuePaymentStatus,
        id: 'queuePaymentStatus',
        header: () => 'Status Pembayaran',
        cell: (info) => {
          const value = info.getValue() as string;
          return (
            <div>
              <LQPayStatusBadge value={value} />
            </div>
          );
        },
        size: 30,
      },
      {
        accessorKey: 'action',
        accessorFn: (row) => row,
        header: '',
        cell: (info) => {
          const data = info.getValue<ILaundryQueue>();
          return (
            <div className="d-flex gap-1">
              <Button
                size="sm"
                variant="blue"
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log(data);
                  // customerPageCtx.onToggleFormActionOffCanvas({
                  //   open: true,
                  //   formType: 'update',
                  //   data: { customer: customerInfo, fetchQueryKey },
                  // });
                }}
              >
                <FeatherIcon name="Info" size={14} />
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  laundryQueueDelCtx.onOpenModal({
                    laundryQueueId: data.laundryQueueId,
                    fetchQueryKey,
                  });
                }}
              >
                <FeatherIcon name="XCircle" size={14} />
              </Button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [laundryQueueDelCtx, fetchQueryKey]
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
    <Card>
      <Card.Header className="pt-4 d-flex justify-content-between align-items-center ">
        <Card.Title className=" mb-0">Data Antrian </Card.Title>
        <BoxButton
          onClick={() => {
            createLaundryQueueCtx.onOpenForm({
              customer: null,
              fetchQueryKey,
            });
          }}
          icon="Plus"
          iconPos="end"
        >
          Tambah
        </BoxButton>
      </Card.Header>
      <Card.Body className="pb-1 table-responsive">
        <div className=" d-flex justify-content-between mb-3 ">
          <div className="d-flex gap-3">
            <Form.Group className="mb-3">
              <Form.Select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 25, 50, 100].map((pg) => (
                  <option key={pg} value={pg}>
                    Show {pg}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3 d-flex align-items-center gap-2 "
              controlId="gotoPage"
            >
              <Form.Label className=" text-nowrap my-0">
                Ke Halaman :{' '}
              </Form.Label>

              <Form.Control
                style={{
                  width: 80,
                }}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </Form.Group>
          </div>
          <div>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => {
                setGlobalFilter(String(value));
              }}
              className="form-control"
              placeholder="Cari data pelanggan"
            />
          </div>
        </div>
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

export default TableLaundryQueue;
