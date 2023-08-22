/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Link from 'next/link';
import * as rtb from '@tanstack/react-table';
import clsx from 'classnames';
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import useDataQuery from '@hooks/useDataQuery';
import { IPayment, IReportTrx, IServiceWithPaginateReturn } from '@interfaces';
// import useNotification from '@hooks/useNotification';
import { getTransactionService } from '@services/transactionService';
import FeatherIcon from '@components/Icons/FeatherIcon';
import { fuzzyFilter, uDate, uRupiah } from '@utils/utils';
import Paginate from '@components/Paginate/Paginate';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import TableLoadingRow from '@components/Tables/TableLoadingRow';
// import { getReportTransactionService } from '@services/reportService';
import BoxButton from '@components/Buttons/BoxButton';

type Props = {
  typeQueryKey: 'transactions' | 'histories';
};

function TableReportTransaction({ typeQueryKey }: Props) {
  // const [startDate, setStartDate] = React.useState<Date | null>(null);
  // const [endDate, setEndDate] = React.useState<Date | null>(null);

  // const {
  //   sorting,
  //   setSorting,
  //   globalFilter,
  //   setGlobalFilter,
  //   pagination,
  //   setPagination,
  //   dataQuery,
  //   defaultData,
  // } = useDataQuery<IServiceWithPaginateReturn<IPayment>>({
  //   queryKeyPrefix: typeQueryKey,
  //   defaultSorting: [],
  //   queryFn: (opt) => getReportTransactionService(opt, typeQueryKey),
  //   defaultData: [],
  // });

  // const columnsDefs = React.useMemo<rtb.ColumnDef<IReportTrx>[]>(
  //   () => [
  //     {
  //       accessorKey: 'invoice',
  //       header: 'Invoice',
  //       size: 60,
  //     },
  //     {
  //       accessorFn: (row) => row.createdAt,
  //       id: 'createdAt',
  //       header: () => 'Waktu',
  //       cell: (info) => {
  //         const value = info.getValue() as string;
  //         return <span>{value}</span>;
  //       },
  //     },
  //     {
  //       accessorFn: (row) => row.cashflowType,
  //       id: 'cashflowType',
  //       header: () => 'Ket',
  //       cell: (info) => {
  //         const value = info.getValue() as string;
  //         return <span className="text-capitalize">{value}</span>;
  //       },
  //     },
  //     {
  //       // eslint-disable-next-line no-underscore-dangle
  //       accessorFn: (row) => row.totalPrice,
  //       id: 'totalPrice',
  //       header: () => 'Total Harga',
  //       cell: (info) => {
  //         const value = info.getValue() as number;
  //         return <span>{uRupiah(+value)}</span>;
  //       },
  //     },
  //     {
  //       accessorKey: 'action',
  //       accessorFn: (row) => row,
  //       header: '',
  //       cell: (info) => {
  //         const trxInfo = info.getValue<IPayment>();
  //         return (
  //           <div className="d-flex gap-1">
  //             <Link
  //               passHref
  //               legacyBehavior
  //               href={`/admin/transaksi/${trxInfo?.invoice}`}
  //             >
  //               <Button size="sm" variant="primary">
  //                 <FeatherIcon name="Info" size={14} />
  //               </Button>
  //             </Link>
  //           </div>
  //         );
  //       },
  //       enableSorting: false,
  //     },
  //   ],
  //   []
  //   // [fetchQueryKey, userActionsCtx, notif]
  // );

  // const table = rtb.useReactTable({
  //   data: dataQuery?.data?.rows ?? defaultData,
  //   columns: columnsDefs,
  //   pageCount: dataQuery?.data?.pageCount ?? -1,
  //   state: {
  //     pagination,
  //     sorting,
  //     globalFilter,
  //   },
  //   filterFns: {
  //     fuzzy: fuzzyFilter,
  //   },
  //   onGlobalFilterChange: setGlobalFilter,
  //   globalFilterFn: fuzzyFilter,
  //   onSortingChange: setSorting,
  //   onPaginationChange: setPagination,
  //   getCoreRowModel: rtb.getCoreRowModel(),
  //   getSortedRowModel: rtb.getSortedRowModel(),
  //   getFacetedRowModel: rtb.getFacetedRowModel(),
  //   getFacetedUniqueValues: rtb.getFacetedUniqueValues(),
  //   getFacetedMinMaxValues: rtb.getFacetedMinMaxValues(),
  //   manualPagination: true,
  //   debugTable: false,
  // });

  // const tableRows = table?.getRowModel()?.rows;
  // const tableHeaders = table.getFlatHeaders();

  // const handleShowButtonClick = () => {
  //   if (startDate && endDate) {
  //     // onShowButtonClick(startDate, endDate);
  //   }
  // };
  return null;
  // return (
  //   <>
  //     <Card>
  //       <Card.Body>
  //         <Card.Title>Filter Laporan</Card.Title>
  //         <Form>
  //           <Row>
  //             <Col md={5}>
  //               {' '}
  //               <Form.Group controlId="startDate">
  //                 <Form.Label>Mulai Tanggal</Form.Label>
  //                 <Form.Control
  //                   type="date"
  //                   value={
  //                     startDate ? startDate.toISOString().split('T')[0] : ''
  //                   }
  //                   onChange={(e) => setStartDate(new Date(e.target.value))}
  //                 />
  //               </Form.Group>
  //             </Col>
  //             <Col md={5}>
  //               <Form.Group controlId="endDate">
  //                 <Form.Label>Tanggal Sampai</Form.Label>
  //                 <Form.Control
  //                   type="date"
  //                   value={endDate ? endDate.toISOString().split('T')[0] : ''}
  //                   onChange={(e) => setEndDate(new Date(e.target.value))}
  //                 />
  //               </Form.Group>
  //             </Col>
  //             <Col md={2} className="d-flex align-items-center ">
  //               <BoxButton
  //                 variant="primary"
  //                 className="w-100"
  //                 size="lg"
  //                 onClick={handleShowButtonClick}
  //               >
  //                 Tampilkan
  //               </BoxButton>
  //             </Col>
  //           </Row>
  //         </Form>
  //       </Card.Body>
  //     </Card>

  //     <Card>
  //       <Card.Header className="pt-4 d-flex justify-content-between align-items-center ">
  //         <Card.Title className=" mb-0">
  //           Semua Data Laporan Transaksi{' '}
  //         </Card.Title>
  //       </Card.Header>
  //       <Card.Body className="pb-1 table-responsive">
  //         <div className=" d-flex justify-content-between mb-3 ">
  //           <div className="d-flex gap-3">
  //             <Form.Group className="mb-3">
  //               <Form.Select
  //                 value={table.getState().pagination.pageSize}
  //                 onChange={(e) => {
  //                   table.setPageSize(Number(e.target.value));
  //                 }}
  //               >
  //                 {[5, 10, 25, 50, 100].map((pg) => (
  //                   <option key={pg} value={pg}>
  //                     Show {pg}
  //                   </option>
  //                 ))}
  //               </Form.Select>
  //             </Form.Group>
  //             <Form.Group
  //               className="mb-3 d-flex align-items-center gap-2 "
  //               controlId="gotoPage"
  //             >
  //               <Form.Label className=" text-nowrap my-0">
  //                 Ke Halaman :{' '}
  //               </Form.Label>

  //               <Form.Control
  //                 disabled={table.getPageCount() <= 1}
  //                 style={{
  //                   width: 80,
  //                 }}
  //                 type="number"
  //                 value={table.getState().pagination.pageIndex + 1}
  //                 onChange={(e) => {
  //                   const page = e.target.value
  //                     ? Number(e.target.value) - 1
  //                     : 0;
  //                   table.setPageIndex(page);
  //                 }}
  //               />
  //             </Form.Group>
  //           </div>
  //           <div>
  //             <DebouncedInput
  //               value={globalFilter ?? ''}
  //               onChange={(value) => {
  //                 setGlobalFilter(String(value));
  //               }}
  //               className="form-control"
  //               placeholder="Cari data transaksi"
  //             />
  //           </div>
  //         </div>
  //         <Table striped bordered hover>
  //           <thead>
  //             {table.getHeaderGroups().map((headerGroup) => (
  //               <tr key={headerGroup.id}>
  //                 {headerGroup.headers.map((header) => {
  //                   return (
  //                     <th
  //                       key={header.id}
  //                       colSpan={header.colSpan}
  //                       style={{ width: header.getSize() }}
  //                       className="text-nowrap"
  //                     >
  //                       {header.isPlaceholder ? null : (
  //                         <div
  //                           {...{
  //                             className: clsx(
  //                               'd-flex align-items-center justify-content-between',
  //                               {
  //                                 'cursor-pointer select-none':
  //                                   header.column.getCanSort(),
  //                               }
  //                             ),
  //                             onClick: header.column.getToggleSortingHandler(),
  //                           }}
  //                         >
  //                           {rtb.flexRender(
  //                             header.column.columnDef.header,
  //                             header.getContext()
  //                           )}
  //                           {{
  //                             asc: (
  //                               <span className="d-flex flex-column justify-content-center ms-2">
  //                                 <FeatherIcon
  //                                   className=" text-dark mb-n1"
  //                                   name="ChevronUp"
  //                                   size={18}
  //                                 />
  //                                 <FeatherIcon
  //                                   className=" text-muted mt-n1 "
  //                                   name="ChevronDown"
  //                                   size={18}
  //                                 />
  //                               </span>
  //                             ),
  //                             desc: (
  //                               <span className="d-flex flex-column justify-content-center ms-2">
  //                                 <FeatherIcon
  //                                   className=" text-muted mb-n1"
  //                                   name="ChevronUp"
  //                                   size={18}
  //                                 />
  //                                 <FeatherIcon
  //                                   className=" text-dark mt-n1 "
  //                                   name="ChevronDown"
  //                                   size={18}
  //                                 />
  //                               </span>
  //                             ),
  //                           }[header.column.getIsSorted() as string] ?? null}
  //                         </div>
  //                       )}
  //                     </th>
  //                   );
  //                 })}
  //               </tr>
  //             ))}
  //           </thead>
  //           <tbody>
  //             <TableLoadingRow
  //               isError={dataQuery?.isError}
  //               rows={tableRows}
  //               isLoading={dataQuery.isLoading}
  //               headerLength={tableHeaders.length}
  //             />

  //             {tableRows.map((row) => {
  //               return (
  //                 <tr key={row.id}>
  //                   {row.getVisibleCells().map((cell) => {
  //                     return (
  //                       <td key={cell.id}>
  //                         {rtb.flexRender(
  //                           cell.column.columnDef.cell,
  //                           cell.getContext()
  //                         )}
  //                       </td>
  //                     );
  //                   })}
  //                 </tr>
  //               );
  //             })}
  //           </tbody>
  //         </Table>
  //       </Card.Body>
  //       <Card.Footer className=" d-flex gap-3 justify-content-between flex-wrap">
  //         <div className="d-flex align-items-center">
  //           <div className="d-flex align-items-center gap-1">
  //             <span>Menampilan</span>
  //             <strong>
  //               {table.getState().pagination.pageIndex + 1} dari{' '}
  //               {table.getPageCount()} halaman
  //             </strong>{' '}
  //             dari {dataQuery?.data?.entriesCount} data |
  //             <span> {table.getRowModel().rows.length} baris ditampilakan</span>
  //           </div>
  //         </div>
  //         <div className="d-flex flex-wrap justify-content-end align-items-center   ">
  //           {dataQuery.isFetching ? (
  //             <div className="me-3 h-100 d-flex align-items-center ">
  //               <Spinner
  //                 size="sm"
  //                 animation="border"
  //                 variant="primary"
  //                 role="status"
  //               >
  //                 <span className="visually-hidden">Loading...</span>
  //               </Spinner>
  //             </div>
  //           ) : null}
  //           <Paginate
  //             onPrevPage={() => table.previousPage()}
  //             isHasPrevPage={table.getCanPreviousPage()}
  //             onNextPage={() => table.nextPage()}
  //             isHasNextPage={table.getCanNextPage()}
  //             totalPages={table.getPageCount()}
  //             loading={dataQuery?.isLoading}
  //             activePage={table.getState().pagination.pageIndex + 1}
  //             onSetPage={table.setPageIndex}
  //           />
  //         </div>
  //       </Card.Footer>
  //     </Card>
  //   </>
  // );
}

export default TableReportTransaction;
