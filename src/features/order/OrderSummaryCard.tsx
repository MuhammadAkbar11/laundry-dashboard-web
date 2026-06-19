import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { ILaundryRoom } from '@interfaces';
import { uDate, uRupiah } from '@utils/utils';
import TableRowInfo from '@components/Utils/TableRowInfo';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import LQPayStatusBadge from '@components/Badges/LQPayStatusBadge';

type Props = {
  room: ILaundryRoom;
};

function OrderSummaryCard({ room }: Props) {
  const { laundryQueue } = room;
  const deliveryLabel =
    laundryQueue?.deliveryType === 'DELIVERED'
      ? 'Antar Jemput'
      : 'Ambil Sendiri';

  return (
    <Card className="shadow-none border h-100">
      <Card.Header className="bg-light">
        <Card.Title className="mb-0 text-accent1">Ringkasan Pesanan</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table borderless className="mb-0">
          <tbody>
            <TableRowInfo
              label="Nomor Pesanan"
              nowrapLabel
              value={<span className="fw-semibold">{room.laundryQueueId}</span>}
            />
            <TableRowInfo
              label="Tanggal Pesan"
              nowrapLabel
              value={<span>{uDate(laundryQueue?.createdAt)}</span>}
            />
            <TableRowInfo
              label="Pelanggan"
              nowrapLabel
              value={<span>{laundryQueue?.customer?.name || '-'}</span>}
            />
            <TableRowInfo
              label="Pengiriman"
              nowrapLabel
              value={<span>{deliveryLabel}</span>}
            />
            <TableRowInfo
              label="Status Cucian"
              nowrapLabel
              value={<LQStatusBadge value={laundryQueue?.status} />}
            />
            <TableRowInfo
              label="Status Bayar"
              nowrapLabel
              value={
                <LQPayStatusBadge value={laundryQueue?.queuePaymentStatus} />
              }
            />
            {room.total > 0 ? (
              <TableRowInfo
                label="Estimasi Total"
                nowrapLabel
                value={
                  <span className="fw-semibold">{uRupiah(room.total)}</span>
                }
              />
            ) : null}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default OrderSummaryCard;
