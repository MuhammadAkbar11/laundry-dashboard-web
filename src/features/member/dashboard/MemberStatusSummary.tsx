import React from 'react';
import { Card, Col, Placeholder, Row } from 'react-bootstrap';

type Order = { status: string };

type Props = {
  orders?: Order[];
  loading?: boolean;
};

// Active laundry statuses, mapped to Indonesian labels used across the app.
const STATUS_LABELS: { key: string; label: string; variant: string }[] = [
  { key: 'PENDING', label: 'Menunggu', variant: 'warning' },
  { key: 'ONHOLD', label: 'Proses', variant: 'info' },
  { key: 'WASHED', label: 'Dicuci', variant: 'primary' },
];

function MemberStatusSummary({ orders = [], loading = false }: Props) {
  const counts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="shadow-none border h-100">
      <Card.Body>
        <Card.Title>Status Cucian Aktif</Card.Title>
        <Row className="g-2 mt-1 text-center">
          {STATUS_LABELS.map((status) => (
            <Col xs={4} key={status.key}>
              <div className="member-status-tile rounded border py-3">
                {loading ? (
                  <Placeholder as="h3" animation="glow" className="mb-1">
                    <Placeholder xs={4} />
                  </Placeholder>
                ) : (
                  <h3 className={`fw-bold mb-0 text-${status.variant}`}>
                    {counts[status.key] || 0}
                  </h3>
                )}
                <span className="small text-muted">{status.label}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

MemberStatusSummary.defaultProps = {
  orders: [],
  loading: false,
};

export default MemberStatusSummary;
