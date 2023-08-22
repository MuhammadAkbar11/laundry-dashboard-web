/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import * as Interfaces from '@interfaces';
import { getReportTrxService } from '@services/reportService';
import TableLoadingRow from '../TableLoadingRow';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
import { uRupiah } from '@utils/utils';

type Props = {};

function TableReportTrxYears({}: Props) {
  const { data, isLoading, isError } = useQuery(['report-trx'], () =>
    getReportTrxService<Interfaces.IReportTrxYears[]>('year')
  );

  return (
    <Card>
      <Card.Header className="pt-4 d-flex justify-content-between align-items-center ">
        <Card.Title className=" mb-0">Semua Data Laporan Transaksi </Card.Title>
      </Card.Header>
      <Card.Body>
        {' '}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tahun</th>
              <th>Transaksi Masuk</th>
              <th>Transaksi Keluar</th>
              <th>Pendapatan</th>
              <th>Pengeluaran</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <TableLoadingRow
              isError={isError}
              rows={data as any[]}
              isLoading={isLoading}
              headerLength={6}
            />

            {data
              ? data?.map((trx, index) => {
                  const key = index;
                  return (
                    <tr key={key}>
                      <td>{trx?.value}</td>
                      <td>{trx?.income}</td>
                      <td>{trx?.expense}</td>
                      <td>{uRupiah(Number(trx?.incomeTotal || 0))}</td>
                      <td>{uRupiah(Number(trx?.expenseTotal || 0))}</td>
                      <td>
                        <Link
                          passHref
                          legacyBehavior
                          href={`/admin/laporan/transaksi/${trx?.value}`}
                        >
                          <BoxButton icon="Info" size="sm">
                            Detail
                          </BoxButton>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default TableReportTrxYears;
