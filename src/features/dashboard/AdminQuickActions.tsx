import React from 'react';
import Link from 'next/link';
import { Card, Col, Row } from 'react-bootstrap';
import AppIcon from '@components/Icons/AppIcon';
import { LucideIconTypes } from '@utils/types';

type QuickAction = {
  label: string;
  href: string;
  icon: LucideIconTypes;
};

const actions: QuickAction[] = [
  { label: 'Antrian Laundry', href: '/admin/laundry/antrian', icon: 'Plus' },
  { label: 'Tambah Member', href: '/admin/laundry/member', icon: 'UserPlus' },
  { label: 'Catat Pengeluaran', href: '/admin/pengeluaran', icon: 'Wallet' },
  { label: 'Laporan', href: '/admin/laporan/transaksi', icon: 'FileText' },
  { label: 'Kelola User', href: '/admin/laundry/user', icon: 'Users' },
];

type Props = {};

function AdminQuickActions({}: Props) {
  return (
    <Row xs={2} md={3} xl={5} className="g-3">
      {actions.map((action) => (
        <Col key={action.href}>
          <Link href={action.href} className="text-decoration-none">
            <Card className="admin-quick-action h-100">
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <span className="admin-quick-action-icon d-flex align-items-center justify-content-center rounded">
                  <AppIcon name={action.icon} size={18} />
                </span>
                <span className="fw-semibold text-dark small">
                  {action.label}
                </span>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default AdminQuickActions;
