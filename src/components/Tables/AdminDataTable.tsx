/* eslint-disable no-underscore-dangle */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import clsx from 'classnames';
import { Card, Form, Spinner, Table } from 'react-bootstrap';
import * as rtb from '@tanstack/react-table';
import Paginate from '@components/Paginate/Paginate';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import FeatherIcon from '@components/Icons/FeatherIcon';
import TableLoadingRow from './TableLoadingRow';
import { fuzzyFilter } from '@utils/utils';

type AdminDataTableProps<TData> = {
  title: string;
  columns: rtb.ColumnDef<TData>[];
  data: TData[];
  isLoading: boolean;
  isFetching?: boolean;
  isError?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  entriesCount: number;
  sorting: rtb.SortingState;
  globalFilter: string;
  enableSearch?: boolean;
  onSortingChange: rtb.OnChangeFn<rtb.SortingState>;
  onPaginationChange: rtb.OnChangeFn<rtb.PaginationState>;
  onGlobalFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  headerActions?: React.ReactNode;
  onRowClick?: (row: TData) => void;
};

function AdminDataTable<TData>({
  title,
  columns,
  data,
  isLoading,
  isFetching = false,
  isError = false,
  enableSearch = false,
  pageCount,
  pageIndex,
  pageSize,
  entriesCount,
  sorting,
  globalFilter,
  onSortingChange,
  onPaginationChange,
  onGlobalFilterChange,
  searchPlaceholder = 'Cari data',
  pageSizeOptions = [5, 10, 25, 50, 100],
  headerActions,
  onRowClick,
}: AdminDataTableProps<TData>) {
  const paginationState = React.useMemo<rtb.PaginationState>(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  const state = React.useMemo(
    () => ({
      pagination: paginationState,
      sorting,
      globalFilter,
    }),
    [paginationState, sorting, globalFilter]
  );

  const defaultData = React.useMemo<TData[]>(() => [], []);

  const table = rtb.useReactTable<TData>({
    data: data || defaultData,
    columns,
    pageCount: pageCount || -1,
    state,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange: (updater) => {
      const nextValue =
        typeof updater === 'function' ? updater(globalFilter) : updater;
      onGlobalFilterChange(String(nextValue ?? ''));
    },
    globalFilterFn: fuzzyFilter,
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
  const totalPages = table.getPageCount();

  const handleGotoPage = (raw: string) => {
    const value = raw ? Number(raw) - 1 : 0;
    if (Number.isNaN(value)) {
      table.setPageIndex(0);
      return;
    }
    const clamped = Math.max(0, Math.min(value, Math.max(0, totalPages - 1)));
    table.setPageIndex(clamped);
  };
  return (
    <Card>
      <Card.Header className="pt-4 d-flex justify-content-between align-items-center bg-light">
        <Card.Title className="mb-0">{title}</Card.Title>
        {headerActions ? <div>{headerActions}</div> : null}
      </Card.Header>
      <Card.Body className="pb-1 table-responsive">
        <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex gap-3">
            <Form.Group className="mb-3">
              <Form.Select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {pageSizeOptions.map((pg) => (
                  <option key={pg} value={pg}>
                    Show {pg}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3 d-flex align-items-center gap-2"
              controlId={`gotoPage-${title.replace(/\s+/g, '-')}`}
            >
              <Form.Label className="text-nowrap my-0">Ke Halaman: </Form.Label>
              <Form.Control
                disabled={totalPages <= 1}
                style={{ width: 80 }}
                type="number"
                min={1}
                max={Math.max(1, totalPages)}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => handleGotoPage(e.target.value)}
                onBlur={(e) => handleGotoPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGotoPage((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </Form.Group>
          </div>
          {enableSearch ? (
            <div>
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={(value) => {
                  onGlobalFilterChange(String(value));
                }}
                className="form-control"
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}
        </div>
        <Table striped bordered hover>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="text-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          'd-flex align-items-center justify-content-between',
                          {
                            'cursor-pointer select-none':
                              header.column.getCanSort(),
                          }
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {rtb.flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <span className="d-flex flex-column justify-content-center ms-2">
                              <FeatherIcon
                                className="text-dark mb-n1"
                                name="ChevronUp"
                                size={18}
                              />
                              <FeatherIcon
                                className="text-muted mt-n1"
                                name="ChevronDown"
                                size={18}
                              />
                            </span>
                          ),
                          desc: (
                            <span className="d-flex flex-column justify-content-center ms-2">
                              <FeatherIcon
                                className="text-muted mb-n1"
                                name="ChevronUp"
                                size={18}
                              />
                              <FeatherIcon
                                className="text-dark mt-n1"
                                name="ChevronDown"
                                size={18}
                              />
                            </span>
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <TableLoadingRow
              isError={isError}
              rows={tableRows}
              isLoading={isLoading}
              headerLength={tableHeaders.length}
            />
            {tableRows.map((row) => {
              const clickable = Boolean(onRowClick);
              return (
                <tr
                  key={row.id}
                  onClick={
                    clickable ? () => onRowClick?.(row.original) : undefined
                  }
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick?.(row.original);
                          }
                        }
                      : undefined
                  }
                  role={clickable ? 'button' : undefined}
                  tabIndex={clickable ? 0 : -1}
                  style={clickable ? { cursor: 'pointer' } : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {rtb.flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex gap-3 justify-content-between flex-wrap">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-1">
            <span>Menampilkan</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} dari {totalPages}{' '}
              halaman
            </strong>{' '}
            dari {entriesCount} data |{' '}
            <span>{table.getRowModel().rows.length} baris ditampilkan</span>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-end align-items-center">
          {isFetching ? (
            <div className="me-3 h-100 d-flex align-items-center">
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
            totalPages={totalPages}
            loading={isLoading}
            activePage={table.getState().pagination.pageIndex + 1}
            onSetPage={table.setPageIndex}
          />
        </div>
      </Card.Footer>
    </Card>
  );
}

export default AdminDataTable;
