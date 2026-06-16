import React from 'react';
import Link from 'next/link';
import { Card, Placeholder, Table } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import EmptyState from '@components/Web/EmptyState/EmptyState';

type Order = {
  orderNumber: string;
  status: string;
  createdAt: string;
};

type Props = {
  title: string;
  orders?: Order[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  emptyIcon?: IconProp;
  viewAllHref?: string;
};

function MemberOrderList({
  title,
  orders = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  viewAllHref,
}: Props) {
  let content: React.ReactNode;
  if (loading) {
    content = (
      <Placeholder as="div" animation="glow">
        {[0, 1, 2].map((row) => (
          <Placeholder key={row} xs={12} className="mb-2" size="lg" />
        ))}
      </Placeholder>
    );
  } else if (orders.length === 0) {
    content = (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  } else {
    content = (
      <Table hover responsive size="sm" className="align-middle mb-0">
        <thead>
          <tr>
            <th>Nomor Cucian</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNumber}>
              <td>
                <Link
                  href={`/m/cucian/${order.orderNumber}`}
                  className="fw-semibold text-accent1 text-decoration-none"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td>
                <LQStatusBadge value={order.status} />
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Card className="shadow-none border h-100">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Card.Title className="mb-0">{title}</Card.Title>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="small fw-semibold text-accent1 text-decoration-none"
            >
              Lihat semua
            </Link>
          ) : null}
        </div>

        {content}
      </Card.Body>
    </Card>
  );
}

MemberOrderList.defaultProps = {
  orders: [],
  loading: false,
  emptyDescription: undefined,
  emptyIcon: undefined,
  viewAllHref: undefined,
};

export default MemberOrderList;
