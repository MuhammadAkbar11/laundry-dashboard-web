import React from 'react';
import Link from 'next/link';
import { Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faCartPlus,
  faExchangeAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type QuickAction = {
  label: string;
  href: string;
  icon: IconProp;
};

const actions: QuickAction[] = [
  { label: 'Pesan Cucian', href: '/m/pemesanan', icon: faCartPlus },
  { label: 'Lihat Antrian', href: '/m/antrian', icon: faBagShopping },
  { label: 'Transaksi', href: '/m/transaksi', icon: faExchangeAlt },
  // { label: 'Notifikasi', href: '/m/notifications', icon: faBell },
  { label: 'Profile', href: '/m/profile', icon: faUser },
];

type Props = {};

function MemberQuickActions({}: Props) {
  return (
    <>
      {/* <Row className="g-3 mb-2">
        <Col xs={12}>
          <Link href="/m/pemesanan" className="text-decoration-none">
            <Card className="member-quick-action member-quick-action-primary shadow-none border-0 h-100">
              <Card.Body className="d-flex flex-row align-items-center justify-content-center gap-2 py-3">
                <FontAwesomeIcon
                  icon={faCartPlus}
                  className="text-white"
                  size="lg"
                />
                <span className="fw-bold text-white">
                  Pesan Cucian Sekarang
                </span>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row> */}
      <Row className="g-3 mt-2 mb-3">
        {actions.map((action) => (
          <Col xs={6} md={3} key={action.href}>
            <Link href={action.href} className="text-decoration-none">
              <Card className="member-quick-action shadow-none border h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center py-1">
                  <FontAwesomeIcon
                    icon={action.icon}
                    className="text-accent1 mb-2"
                    size="lg"
                  />
                  <span className="fw-semibold text-dark small">
                    {action.label}
                  </span>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default MemberQuickActions;
