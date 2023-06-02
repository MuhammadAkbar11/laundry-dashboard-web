/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { ICustomer, getCustomersService } from '@/services/customerService';
import FeatherIcon from '@components/Icons/FeatherIcon';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import Paginate from '@components/Paginate/Paginate';
import { useQuery } from '@tanstack/react-query';
import clsx from 'classnames';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '@utils/utils';
import React from 'react';
import { Badge, Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import { useCustomerPageContext } from '@utils/context/Customer/CustomerPageContext';
import { useCustomerDeleteContext } from '@utils/context/Customer/CustomerDeleteContext';

type Props = {};

function TableCustomer({}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'customerId', desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const customerPageCtx = useCustomerPageContext();
  const customerDeleteCtx = useCustomerDeleteContext();

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
      sorting,
      searchTerm: globalFilter,
    }),
    [globalFilter, sorting, pageIndex, pageSize]
  );

  const fetchQueryKey = React.useMemo(
    () => ['customers', fetchDataOptions],
    [fetchDataOptions]
  );

  const columnsDefs = React.useMemo<ColumnDef<ICustomer>[]>(
    () => [
      {
        accessorKey: 'customerId',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'name',
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>Nama</span>,
      },
      {
        // enableSorting: false,
        accessorFn: (row) => row.customerLevel.name,
        id: 'customerLevelId',
        header: () => 'Level',
        cell: (info) => {
          const value = info.getValue() as string;

          const clsNm = clsx('p-2 rounded-0', {
            'bg-primary': value?.toLocaleLowerCase().includes('basic'),
            'bg-warning': value?.toLocaleLowerCase().includes('gold'),
            'bg-dark': value?.toLocaleLowerCase().includes('plat'),
          });

          return <Badge className={clsNm}>{value}</Badge>;
        },
        // sortingFn: (info) => info.g
        size: 50,
      },
      {
        enableSorting: false,
        // accessorKey: 'address',
        accessorFn: (row) => ({ address: row.address, phone: row.phone }),
        id: 'contacts',
        cell: (info) => {
          const values = info.getValue() as { address: string; phone: string };
          return (
            <>
              <p className="mb-1">
                <strong>Alamat</strong> : {values?.address}
              </p>
              <p>
                <strong>Phone</strong> : {values?.phone}
              </p>
            </>
          );
        },
        header: () => <span>Kontak</span>,
        minSize: 150,
      },
      {
        // enableSorting: false,
        // eslint-disable-next-line no-underscore-dangle
        accessorFn: (row) => row?._count?.laundryQueues,
        id: 'countLaundryQueue',
        header: () => 'Total Cucian',
        cell: (info) => `${info.getValue()} Cucian`,
        size: 2,
      },
      {
        accessorKey: 'point',
        header: 'Point',
        size: 10,
      },
      {
        accessorKey: 'action',
        accessorFn: (row) => row,
        header: '',
        cell: (info) => {
          const customerInfo = info.getValue<ICustomer>();
          return (
            <div className="d-flex gap-1">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  customerPageCtx.onToggleFormActionOffCanvas({
                    open: true,
                    formType: 'update',
                    data: { customer: customerInfo, fetchQueryKey },
                  });
                }}
              >
                <FeatherIcon name="Edit" size={14} />
              </Button>
              {/* <Button size="sm" variant="info">
                <FeatherIcon name="Info" size={14} />
              </Button> */}
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  customerDeleteCtx.onOpenModal({
                    customerId: customerInfo.customerId,
                    fetchQueryKey,
                  });
                }}
              >
                <FeatherIcon name="Trash" size={14} />
              </Button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [customerPageCtx, customerDeleteCtx, fetchQueryKey]
  );

  const dataQuery = useQuery(
    fetchQueryKey,
    () => getCustomersService(fetchDataOptions),
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
  // console.log();
  const table = useReactTable({
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    debugTable: false,
  });

  // when the globalFilter is reset page index
  React.useEffect(() => {
    if (globalFilter) {
      table.setPageIndex(0);
    }
  }, [globalFilter, table]);

  const rows = table?.getRowModel()?.rows;
  const headers = table.getFlatHeaders();

  return (
    <Card>
      <Card.Header className="pt-4 d-flex justify-content-between ">
        <Card.Title className=" mb-0">Data Pelanggan </Card.Title>
        <Button
          onClick={() => {
            customerPageCtx.onToggleFormActionOffCanvas({
              formType: 'create',
              open: true,
              data: {
                fetchQueryKey: [
                  'customers',
                  {
                    sorting: [{ id: 'customerId', desc: true }],
                    pageIndex: 0,
                    pageSize: 10,
                    searchTerm: '',
                  },
                ],
              },
            });
          }}
        >
          <span className="d-flex gap-2 align-items-center">
            <FeatherIcon name="Plus" />
            Tambah
          </span>
        </Button>
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
            {dataQuery.isLoading ? (
              <tr>
                <td colSpan={headers.length} className="text-center">
                  <Spinner
                    size="sm"
                    animation="border"
                    variant="primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            ) : rows ? (
              rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length}>
                    <p className="text-center mb-0">
                      Tidak ada data yang ditemukan
                    </p>
                  </td>
                </tr>
              ) : null
            ) : (
              <tr>
                <td colSpan={headers.length}>
                  <p className="text-center mb-0">
                    Terjadi kesalahan saat memuat data
                  </p>
                </td>
              </tr>
            )}

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

export default TableCustomer;
