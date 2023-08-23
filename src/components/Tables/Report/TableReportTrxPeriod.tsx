/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import * as Interfaces from '@interfaces';
import {
  getReportTransactionService,
  getReportTrxPeriodService,
} from '@services/reportService';
import TableLoadingRow from '../TableLoadingRow';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
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
import { useRouter } from 'next/router';
import { format } from 'date-fns';

type Props = { startDate: Date; endDate: Date; dateStr: string };

function TableReportTrxPeriod({
  startDate: startDateProps,
  endDate: endDateProps,
  dateStr,
}: Props) {
  const [startDateInput, setStartDateInput] = React.useState<Date | null>();
  const [endDateInput, setEndDateInput] = React.useState<Date | null>();
  const [startDate, setStartDate] = React.useState<Date>(startDateProps);
  const [endDate, setEndDate] = React.useState<Date>(endDateProps);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    });

  const router = useRouter();

  const fetchDataOptions = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
      startDate: format(new Date(startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(endDate), 'yyyy-MM-dd'),
    }),
    [pageIndex, pageSize, startDate, endDate]
  );

  const fetchQueryKey = React.useMemo(
    () => ['report-trx-period', fetchDataOptions],
    [fetchDataOptions]
  );

  const columnsDefs = React.useMemo<ColumnDef<Interfaces.IReportTrx>[]>(
    () => [
      {
        enableSorting: false,
        accessorFn: (row) => row.time,
        header: 'Waktu',
        cell: (info) => {
          const infoValue = info.getValue() as string;
          return uDate(infoValue);
        },
      },
      {
        enableSorting: false,
        accessorKey: 'invoice',
        header: 'Invoice',
      },
      {
        enableSorting: false,
        accessorFn: (row) => row.type,
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
        accessorFn: (row) => row.amount,
        id: 'nominal',
        header: () => 'nominal',
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
          const infoData = info.getValue<Interfaces.IReportTrx>();
          // eslint-disable-next-line no-console
          // eslint-disable-next-line no-console
          if (infoData.type === 'IN') {
            return (
              <div className="d-flex gap-1">
                <Link
                  legacyBehavior
                  passHref
                  href={`/admin/transaksi/${infoData.invoice}`}
                >
                  <Button size="sm" variant="primary">
                    <FeatherIcon name="Info" size={14} />
                  </Button>
                </Link>
              </div>
            );
          }
          return null;
        },
        enableSorting: false,
      },
    ],
    []
  );

  const dataQuery = useQuery(
    fetchQueryKey,
    () => getReportTrxPeriodService(fetchDataOptions),
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

  const handlePeriodeClick = () => {
    if (startDateInput && endDateInput) {
      // onShowButtonClick(startDate, endDate);
      // const startDateFormat = format(new Date(startDateInput), 'yyyy-MM-dd');
      // const endDateFormat = format(new Date(endDateInput), 'yyyy-MM-dd');

      setStartDate(startDateInput);
      setEndDate(endDateInput);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Filter Laporan</Card.Title>
          <Form>
            <Row>
              <Col md={5}>
                {' '}
                <Form.Group controlId="startDateInput">
                  <Form.Label>Mulai Tanggal</Form.Label>
                  <Form.Control
                    type="date"
                    value={
                      startDateInput
                        ? startDateInput.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setStartDateInput(new Date(e.target.value))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="endDateInput">
                  <Form.Label>Tanggal Sampai</Form.Label>
                  <Form.Control
                    type="date"
                    value={
                      endDateInput
                        ? endDateInput.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => setEndDateInput(new Date(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center ">
                <BoxButton
                  variant="primary"
                  className="w-100"
                  size="lg"
                  onClick={handlePeriodeClick}
                  isLoading={dataQuery.isLoading}
                >
                  Tampilkan
                </BoxButton>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header className="pt-4 d-flex justify-content-between align-items-center ">
          <Card.Title className=" mb-0">
            Semua Data Laporan Transaksi {dateStr}
          </Card.Title>
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
    </>
  );
}

export default TableReportTrxPeriod;
