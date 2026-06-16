import React from 'react';
import Link from 'next/link';
import { Card, Placeholder, Table } from 'react-bootstrap';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import EmptyState from '@components/Web/EmptyState/EmptyState';

type RecentOrder = {
  orderNumber: string;
  customerName: string | null;
  status: string;
  createdAt: string;
};

type Props = {
  orders?: RecentOrder[];
  loading?: boolean;
};

function AdminRecentOrders({ orders = [], loading = false }: Props) {
  let content: React.ReactNode;
  if (loading) {
    content = (
      <Placeholder as="div" animation="glow" className="p-3">
        {[0, 1, 2, 3, 4].map((row) => (
          <Placeholder key={row} xs={12} className="mb-2" size="lg" />
        ))}
      </Placeholder>
    );
  } else if (orders.length === 0) {
    content = (
      <EmptyState
        title="Belum ada laundry"
        description="Laundry terbaru akan muncul di sini."
        icon={faBagShopping}
      />
    );
  } else {
    content = (
      <Table hover responsive size="sm" className="align-middle mb-0">
        <thead>
          <tr>
            <th>No Laundry</th>
            <th>Pelanggan</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNumber}>
              <td className="fw-semibold">{order.orderNumber}</td>
              <td className="text-nowrap">{order.customerName || '-'}</td>
              <td>
                <LQStatusBadge value={order.status} />
              </td>
              <td className="text-nowrap">
                {new Date(order.createdAt).toLocaleDateString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-light d-flex align-items-center justify-content-between">
        <Card.Title className="mb-0">Laundry Terbaru</Card.Title>
        <Link
          href="/admin/laundry/antrian"
          className="small fw-semibold text-decoration-none"
        >
          Lihat semua
        </Link>
      </Card.Header>
      <Card.Body>{content}</Card.Body>
    </Card>
  );
}

AdminRecentOrders.defaultProps = {
  orders: [],
  loading: false,
};

export default AdminRecentOrders;
