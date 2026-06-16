import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import EmptyState from '@components/Web/EmptyState/EmptyState';

type StatusItem = {
  status: string;
  count: number;
};

type Props = {
  title: string;
  items?: StatusItem[];
  loading?: boolean;
  emptyTitle: string;
  emptyIcon?: IconProp;
  renderBadge: (status: string) => React.ReactNode;
};

function AdminStatusOverview({
  title,
  items = [],
  loading = false,
  emptyTitle,
  emptyIcon,
  renderBadge,
}: Props) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const sorted = [...items].sort((a, b) => b.count - a.count);

  let content: React.ReactNode;
  if (loading) {
    content = (
      <Placeholder as="div" animation="glow">
        {[0, 1, 2, 3].map((row) => (
          <Placeholder key={row} xs={12} className="mb-2" size="lg" />
        ))}
      </Placeholder>
    );
  } else if (items.length === 0) {
    content = <EmptyState title={emptyTitle} icon={emptyIcon} />;
  } else {
    content = (
      <ul className="admin-status-list list-unstyled mb-0">
        {sorted.map((item) => (
          <li
            key={item.status}
            className="d-flex align-items-center justify-content-between py-2 border-bottom"
          >
            {renderBadge(item.status)}
            <span className="fw-bold text-dark">{item.count}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-light d-flex align-items-center justify-content-between">
        <Card.Title className="mb-0">{title}</Card.Title>
        {!loading && items.length > 0 ? (
          <span className="text-muted small">Total: {total}</span>
        ) : null}
      </Card.Header>
      <Card.Body>{content}</Card.Body>
    </Card>
  );
}

AdminStatusOverview.defaultProps = {
  items: [],
  loading: false,
  emptyIcon: undefined,
};

export default AdminStatusOverview;
